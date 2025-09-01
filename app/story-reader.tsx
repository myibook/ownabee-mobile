import PageViewer from '@/components/PageViewer';
import ReaderPageSidebar from '@/components/ReaderPageSidebar';
import TopBar from '@/components/TopBar';
import IconButton from '@/components/ui/IconButton';
import { Colors } from '@/constants/Colors';
import { useReader } from '@/context/ReaderProvider';
import { styles } from '@/src/styles/story-reader/styles.module';
import { CanvasTextItem, FlatItem, Page, TranscriptWord } from '@/types/audiobook';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Constants
const SWIPE_THRESHOLD = 200;
const VELOCITY_THRESHOLD = 500;
const RUBBER_BAND_RESISTANCE = 0.1;
const MAX_RUBBER_BAND_TRANSLATION = 20;
const AUTO_PLAY_DELAY = 100;
const AUDIO_END_THRESHOLD = 1000;
const PAGE_CHANGE_AUDIO_DELAY = 100;
const PAGE_TRANSITION_DURATION = 300;
const READER_DATA_CLEANUP_DELAY = 6000;

export default function StoryReaderScreen() {
  const [currentView, setCurrentView] = useState(0);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAudioElement, setCurrentAudioElement] = useState<CanvasTextItem | null>(null);
  const [isAutoPageChange, setIsAutoPageChange] = useState(false);
  const currentPositionMs = useSharedValue(0);

  const { bookData, clearReaderData } = useReader();
  const book = bookData!;
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const nextSoundRef = useRef<Audio.Sound | null>(null);
  const currentElementRef = useRef<CanvasTextItem | null>(null);
  const preloadedElementRef = useRef<CanvasTextItem | null>(null);
  const isPreloadingRef = useRef<boolean>(false);

  const totalPages = book.pages.length;
  const totalViews = 1 + Math.ceil(totalPages / 2);

  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState<'cover' | number | null>(
    'cover'
  );

  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const coverViewIndex = 0;
  const lastViewIndex = totalViews - 1;

  // element caching
  const getAudioElementsFromPage = useCallback((pageIndex: number): CanvasTextItem[] => {
    const page = book.pages[pageIndex];
    if (!page) return [];

    return page.items.filter(
      el => el.type === 'text' && el.audioUrl && el.transcript
    ) as CanvasTextItem[];
  }, []);

  const audioElementsCache = useMemo(() => {
    const cache = new Map<number, CanvasTextItem[]>();
    for (let i = 0; i < book.pages.length; i++) {
      cache.set(i, getAudioElementsFromPage(i));
    }
    return cache;
  }, []);

  // Audio utility functions
  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const findNextAudioElementWithPageInfo = useCallback(
    (
      currentElement: CanvasTextItem
    ): { element: CanvasTextItem | null; needsPageChange: boolean; targetView: number } => {
      // Find the current element's position in the book
      let currentPageIndex = -1;
      let currentElementIndex = -1;

      // Search through all pages to find the current element
      for (let i = 0; i < book.pages.length; i++) {
        const audioElements = getAudioElementsFromPage(i);

        const elementIndex = audioElements.findIndex(el => el === currentElement);
        if (elementIndex !== -1) {
          currentPageIndex = i;
          currentElementIndex = elementIndex;
          break;
        }
      }

      if (currentPageIndex === -1) {
        console.log('Current element not found in any page');
        return { element: null, needsPageChange: false, targetView: 0 };
      }

      console.log(
        `Current element found on page ${currentPageIndex + 1}, element index ${currentElementIndex}`
      );

      // Try to find next element in the same page
      const currentPageAudioElements = getAudioElementsFromPage(currentPageIndex);

      console.log(`Current page has ${currentPageAudioElements.length} audio elements`);

      if (currentElementIndex < currentPageAudioElements.length - 1) {
        console.log('Next element found on same page');
        return {
          element: currentPageAudioElements[currentElementIndex + 1],
          needsPageChange: false,
          targetView: currentView,
        };
      }

      // If no more elements in current page, look in next pages
      console.log('No more elements on current page, looking in next pages...');
      for (let i = currentPageIndex + 1; i < book.pages.length; i++) {
        const nextPageAudioElements = getAudioElementsFromPage(i);

        console.log(`Page ${i + 1} has ${nextPageAudioElements.length} audio elements`);

        if (nextPageAudioElements.length > 0) {
          // Calculate which view this page belongs to
          const targetView = Math.floor(i / 2) + 1;
          console.log(`Found next audio element on page ${i + 1}, target view: ${targetView}`);
          return {
            element: nextPageAudioElements[0],
            needsPageChange: true,
            targetView,
          };
        }
      }

      console.log('No more audio elements found in any pages');
      return { element: null, needsPageChange: false, targetView: 0 };
    },
    [currentView]
  );

  const findElementPosition = useCallback(
    (element: CanvasTextItem): { pageIndex: number; elementIndex: number } | null => {
      for (const [pageIndex, elements] of audioElementsCache.entries()) {
        const elementIndex = elements.findIndex(el => el.id === element.id);
        if (elementIndex !== -1) {
          return { pageIndex, elementIndex };
        }
      }
      return null;
    },
    [audioElementsCache]
  );

  const preloadNextAudio = useCallback(
    async (currentElement: CanvasTextItem) => {
      if (isPreloadingRef.current) return;

      const position = findElementPosition(currentElement);
      if (!position) return;

      const { pageIndex, elementIndex } = position;
      const currentPageElements = audioElementsCache.get(pageIndex) || [];

      let nextElement: CanvasTextItem | null = null;

      // find next element
      if (elementIndex < currentPageElements.length - 1) {
        nextElement = currentPageElements[elementIndex + 1];
      } else {
        for (let i = pageIndex + 1; i < book.pages.length; i++) {
          const elements = audioElementsCache.get(i) || [];
          if (elements.length > 0) {
            nextElement = elements[0];
            break;
          }
        }
      }

      if (!nextElement || !nextElement.audioUrl) return;
      if (preloadedElementRef.current?.id === nextElement.id) return;

      isPreloadingRef.current = true;
      console.log('Preloading next audio:', nextElement.content.substring(0, 50) + '...');

      try {
        if (nextSoundRef.current) {
          await nextSoundRef.current.unloadAsync();
        }

        // preload the next audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: nextElement.audioUrl },
          { shouldPlay: false },
          null,
          false // Don't set up status update yet
        );

        nextSoundRef.current = sound;
        preloadedElementRef.current = nextElement;
        console.log('Successfully preloaded next audio');
      } catch (error) {
        console.error('Error preloading next audio:', error);
      } finally {
        isPreloadingRef.current = false;
      }
    },
    [audioElementsCache, findElementPosition]
  );

  const playNextAudioElementRef = useRef<any>(null);
  const loadAudioRef = useRef<any>(null);

  const onAudioUpdate = useCallback(
    (status: AVPlaybackStatus, transcript: TranscriptWord[]) => {
      if (!status.isLoaded) return;

      const pos = status.didJustFinish
        ? ((status as any).durationMillis ?? 0)
        : ((status as any).positionMillis ?? 0);

      if (status.isPlaying) {
        currentPositionMs.value = pos;
        const idx = transcript.findIndex(({ startMs, endMs }) => pos >= startMs && pos < endMs);
        if (idx !== -1) setCurrentIdx(idx);

        if (
          status.durationMillis &&
          status.positionMillis >= status.durationMillis - AUDIO_END_THRESHOLD
        ) {
          clearAutoPlayTimer();
          autoPlayTimerRef.current = setTimeout(() => {
            const currentEl = currentElementRef.current;
            if (currentEl && playNextAudioElementRef.current) {
              runOnJS(playNextAudioElementRef.current)(currentEl);
            }
          }, AUTO_PLAY_DELAY);
        }
      } else {
        currentPositionMs.value = pos;
      }

      if (status.didJustFinish) {
        clearAutoPlayTimer();
        setTimeout(() => {
          const currentEl = currentElementRef.current;
          if (currentEl && playNextAudioElementRef.current) {
            runOnJS(playNextAudioElementRef.current)(currentEl);
          }
        }, AUTO_PLAY_DELAY);
      }
    },
    [clearAutoPlayTimer]
  );

  const playNextAudioElement = useCallback(
    async (currentElement: CanvasTextItem) => {
      const {
        element: nextElement,
        needsPageChange,
        targetView,
      } = findNextAudioElementWithPageInfo(currentElement);

      if (nextElement) {
        if (needsPageChange && targetView !== currentView) {
          setIsAutoPageChange(true);
          setCurrentView(targetView);
          setTimeout(async () => {
            if (loadAudioRef.current) {
              await loadAudioRef.current(nextElement);
            }
            if (soundRef.current) {
              soundRef.current.playAsync();
              setIsPlaying(true);
            }
            setIsAutoPageChange(false);
          }, PAGE_TRANSITION_DURATION);
        } else {
          if (loadAudioRef.current) {
            await loadAudioRef.current(nextElement);
          }
          if (soundRef.current) {
            soundRef.current.playAsync();
            setIsPlaying(true);
          }
        }
      } else {
        setIsPlaying(false);
        setCurrentIdx(null);
      }
    },
    [findNextAudioElementWithPageInfo, currentView]
  );

  const loadAudio = useCallback(
    async (element: CanvasTextItem) => {
      if (!element.audioUrl || !element.transcript) {
        return;
      }
      if (currentAudioElement?.id === element.id) {
        setIsLoadingAudio(false);
        return;
      }
      setIsLoadingAudio(true);
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(console.error);
      }
      soundRef.current = null;
      try {
        let sound: Audio.Sound;
        if (preloadedElementRef.current?.id === element.id && nextSoundRef.current) {
          sound = nextSoundRef.current;
          nextSoundRef.current = null;
          preloadedElementRef.current = null;
        } else {
          const result = await Audio.Sound.createAsync(
            { uri: element.audioUrl },
            { shouldPlay: false }
          );
          sound = result.sound;
        }
        soundRef.current = sound;
        await soundRef.current.setProgressUpdateIntervalAsync(50);
        soundRef.current.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) =>
          onAudioUpdate(status, element.transcript!)
        );
        currentElementRef.current = element;
        setCurrentAudioElement(element);
        setCurrentIdx(null);
        setIsPlaying(false);
        preloadNextAudio(element);
      } catch (error) {
        console.error('Error loading audio:', error);
        if (soundRef.current) {
          soundRef.current.unloadAsync();
        }
        soundRef.current = null;
        setCurrentAudioElement(null);
      } finally {
        setIsLoadingAudio(false);
      }
    },
    [currentAudioElement, onAudioUpdate, preloadNextAudio]
  );

  useEffect(() => {
    playNextAudioElementRef.current = playNextAudioElement;
    loadAudioRef.current = loadAudio;
  });

  const handleWordClick = useCallback(
    async (i: number, transcript: TranscriptWord[], element: CanvasTextItem) => {
      if (currentAudioElement?.id === element.id && soundRef.current && !isLoadingAudio) {
        const sound = soundRef.current;
        await sound.setPositionAsync(transcript[i].startMs);
        currentPositionMs.value = transcript[i].startMs;

        // resume audio if it was paused
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
        }

        setCurrentIdx(i);
      } else {
        if (!isLoadingAudio) {
          await loadAudio(element);

          const sound = soundRef.current;
          if (!sound) return;

          // Set position to clicked word and play
          await sound.setPositionAsync(transcript[i].startMs);
          currentPositionMs.value = transcript[i].startMs;
          await sound.playAsync();
          setCurrentIdx(i);
          setIsPlaying(true);
          setCurrentAudioElement(element);
        }
      }
    },
    [loadAudio, currentAudioElement, isLoadingAudio]
  );

  // Setup audio mode for playback
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();
  }, []);

  const getThumbnailIndexFromView = useCallback((viewIndex: number): 'cover' | number | null => {
    if (viewIndex === 0) return 'cover';

    const pageViewIndex = viewIndex - 1;
    const leftPageIndex = pageViewIndex * 2;

    if (leftPageIndex < book.pages.length) {
      return leftPageIndex;
    }

    return null;
  }, []);

  // Load audio when current view changes
  useEffect(() => {
    if (currentView === coverViewIndex) return; // Skip cover page
    if (isAutoPageChange) return; // Skip if this is an automatic page change
    if (isLoadingAudio) return; // Skip if audio is currently loading

    console.log('Page view changed to:', currentView, 'isAutoPageChange:', isAutoPageChange);

    // Don't auto-load audio when manually changing pages
    // Only load audio when navigating to a new page for the first time
    const thumbnailIdx = getThumbnailIndexFromView(currentView);
    const isThumbnailNavigation = thumbnailIdx === selectedThumbnailIndex;
    if (currentAudioElement || isThumbnailNavigation) {
      console.log('Skipping auto-audio load - already have current audio element');
      return;
    }

    const pageViewIndex = currentView - 1;
    const leftPageIndex = pageViewIndex * 2;
    const rightPageIndex = leftPageIndex + 1;

    const leftPage = book.pages[leftPageIndex];
    const rightPage = book.pages[rightPageIndex];

    // Find first text element with audio
    let audioElement: CanvasTextItem | null = null;

    if (leftPage) {
      const leftAudioElements = getAudioElementsFromPage(leftPageIndex);
      audioElement = leftAudioElements[0] || null;
    }

    if (!audioElement && rightPage) {
      const rightAudioElements = getAudioElementsFromPage(rightPageIndex);
      audioElement = rightAudioElements[0] || null;
    }

    if (audioElement) {
      console.log('Auto-loading first audio element for new page view');
      loadAudio(audioElement);
      // Auto-play the audio when page changes
      setTimeout(() => {
        if (soundRef.current && !isLoadingAudio) {
          soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }, PAGE_CHANGE_AUDIO_DELAY);
    }
  }, [
    currentView,
    loadAudio,
    isAutoPageChange,
    currentAudioElement,
    selectedThumbnailIndex,
    getThumbnailIndexFromView,
    isLoadingAudio,
  ]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      clearAutoPlayTimer();
    };
  }, [clearAutoPlayTimer]);

  // Gesture handling
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate(event => {
      // rubber band effect when swiping
      let translation = event.translationX * RUBBER_BAND_RESISTANCE;

      if (currentView === coverViewIndex && translation > 0) {
        translation = interpolate(
          translation,
          [0, MAX_RUBBER_BAND_TRANSLATION],
          [0, MAX_RUBBER_BAND_TRANSLATION * 0.5],
          Extrapolation.CLAMP
        );
      } else if (currentView === lastViewIndex && translation < 0) {
        translation = interpolate(
          translation,
          [-MAX_RUBBER_BAND_TRANSLATION, 0],
          [-MAX_RUBBER_BAND_TRANSLATION * 0.5, 0],
          Extrapolation.CLAMP
        );
      }

      translateX.value = translation;
    })
    .onEnd(event => {
      const shouldSwipeLeft =
        event.translationX < -SWIPE_THRESHOLD || event.velocityX < -VELOCITY_THRESHOLD;
      const shouldSwipeRight =
        event.translationX > SWIPE_THRESHOLD || event.velocityX > VELOCITY_THRESHOLD;

      let newView = currentView;

      if (shouldSwipeLeft && currentView < totalViews - 1) {
        newView = currentView + 1;
      } else if (shouldSwipeRight && currentView > 0) {
        newView = currentView - 1;
      }

      runOnJS(setCurrentView)(newView);

      translateX.value = withSpring(
        0,
        {
          damping: 25,
          stiffness: 100,
        },
        () => {
          isDragging.value = false;
        }
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Component renderers
  const CoverPage: React.FC = () => (
    <View style={styles.coverPage}>
      <Image source={{ uri: book.coverPageUrl }} style={styles.coverImage} resizeMode="cover" />
      <View style={styles.swipeOverlay}>
        <MaterialIcons name="swipe" size={24} color={Colors.white} />
        <Text style={styles.swipeText}>Swipe to read</Text>
      </View>
    </View>
  );

  const renderPage = (page: Page) => {
    return (
      <PageViewer
        page={page}
        size={{ width: 500, height: 625 }}
        currentPositionMs={currentPositionMs}
        activeTextId={currentAudioElement?.id}
        onWordPress={handleWordClick}
      />
    );
  };

  const renderPageView = useCallback(
    (viewIndex: number) => {
      if (viewIndex === 0) {
        return <CoverPage />;
      }

      const pageViewIndex: number = viewIndex - 1;
      const leftPageIndex: number = pageViewIndex * 2;
      const rightPageIndex: number = leftPageIndex + 1;

      const leftPage: Page = book.pages[leftPageIndex];
      const rightPage: Page | undefined = book.pages[rightPageIndex];

      // single page
      if (!rightPage) {
        return renderPage(leftPage);
      }

      // two page spread
      return (
        <>
          {renderPage(leftPage)}
          {renderPage(rightPage)}
        </>
      );
    },
    [renderPage]
  );

  // handle keyboard navigation
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight' && currentView < totalViews - 1) {
          setCurrentView(prev => prev + 1);
        } else if (event.key === 'ArrowLeft' && currentView > 0) {
          setCurrentView(prev => prev - 1);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentView, totalViews]);

  // page navigation using back/forward buttons
  // cycles through individual pages rather than views
  const handlePreviousPage = useCallback(async () => {
    let previousPageIndex: 'cover' | number;

    if (typeof selectedThumbnailIndex === 'number') {
      if (selectedThumbnailIndex === 0) {
        previousPageIndex = 'cover';
      } else {
        previousPageIndex = selectedThumbnailIndex - 1;
      }
    } else {
      return;
    }

    await handleThumbnailPress(previousPageIndex);
  }, [selectedThumbnailIndex]);

  const handleNextPage = useCallback(async () => {
    let nextPageIndex: 'cover' | number;

    if (selectedThumbnailIndex === 'cover') {
      nextPageIndex = 0;
    } else if (typeof selectedThumbnailIndex === 'number') {
      if (selectedThumbnailIndex >= book.pages.length - 1) {
        return;
      }
      nextPageIndex = selectedThumbnailIndex + 1;
    } else {
      return;
    }

    await handleThumbnailPress(nextPageIndex);
  }, [selectedThumbnailIndex]);

  const handleBackPress = useCallback(async () => {
    // Reset all states
    setIsPlaying(false);
    setCurrentIdx(null);
    setCurrentAudioElement(null);
    setCurrentView(0);
    setSelectedThumbnailIndex('cover');

    // Navigate back
    // Note: In a real app, you might want to use router.back() or similar
    console.log('Navigating back to story detail');
    router.back();

    // Clear reader data after 2 seconds to avoid re-render with empty data
    setTimeout(() => {
      clearReaderData();
    }, READER_DATA_CLEANUP_DELAY);
  }, [clearAutoPlayTimer]);

  const getViewFromPageIndex = (pageIndex: 'cover' | number): number => {
    if (pageIndex === 'cover') return 0;
    return Math.floor(pageIndex / 2) + 1;
  };

  const handleThumbnailPress = useCallback(
    async (pageIndex: 'cover' | number) => {
      // First, handle the state change immediately to prevent race conditions
      const targetView = getViewFromPageIndex(pageIndex);

      if (selectedThumbnailIndex === pageIndex) {
        // If the same thumbnail is pressed, just toggle play/pause
        if (soundRef.current && currentAudioElement) {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded) {
            if (status.isPlaying) {
              await soundRef.current.pauseAsync();
              setIsPlaying(false);
            } else {
              await soundRef.current.playAsync();
              setIsPlaying(true);
            }
          }
        }
        // Special case for cover page to handle stop/restart
        if (pageIndex === 'cover' && soundRef.current) {
          await soundRef.current.stopAsync();
          setIsPlaying(false);
        }
        return;
      }

      // If a different thumbnail is pressed, stop current audio and change view
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setIsPlaying(false);
      }
      setCurrentAudioElement(null); // Crucial: Reset the current element state
      setCurrentIdx(null);

      // Change view and selected thumbnail
      setCurrentView(targetView);
      setSelectedThumbnailIndex(pageIndex);

      // Now, load the new audio if a numbered page is selected
      if (typeof pageIndex === 'number' && pageIndex >= 0 && pageIndex < book.pages.length) {
        const audioElements = getAudioElementsFromPage(pageIndex);
        if (audioElements.length > 0) {
          const firstAudioElement = audioElements[0];
          await loadAudio(firstAudioElement);
          if (soundRef.current) {
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
        }
      }
    },
    [loadAudio, selectedThumbnailIndex, currentAudioElement, getAudioElementsFromPage]
  );

  // sync highlighted thumbnail when audio, swipe or buttons are used to change pages
  useEffect(() => {
    const thumbnailIdx = getThumbnailIndexFromView(currentView);

    // check if selected thumbnail is already in view
    if (selectedThumbnailIndex === 'cover' && currentView === coverViewIndex) return;
    if (typeof selectedThumbnailIndex === 'number') {
      const currentSelectedView = getViewFromPageIndex(selectedThumbnailIndex);
      if (currentSelectedView === currentView) return;
    }

    setSelectedThumbnailIndex(thumbnailIdx);
  }, [currentView, getThumbnailIndexFromView, selectedThumbnailIndex]);

  const flatTimeline = useMemo(() => {
    const items: FlatItem[] = [];
    let offset = 0;
    for (let pageIndex = 0; pageIndex < book.pages.length; pageIndex++) {
      const audioEls = getAudioElementsFromPage(pageIndex);
      const viewIndex = Math.floor(pageIndex / 2) + 1;
      for (const el of audioEls) {
        const durationMs = el.transcript ? Math.max(...el.transcript.map(w => w.endMs)) : 0;
        const startMs = offset;
        const endMs = startMs + durationMs;
        items.push({ element: el, pageIndex, viewIndex, startMs, endMs, durationMs });
        offset = endMs;
      }
    }
    return {
      items,
      totalDurationMs: offset,
    };
  }, [getAudioElementsFromPage]);

  const togglePlayPause = useCallback(async () => {
    // 1) cover page (first page)
    if (currentView === coverViewIndex && (!currentAudioElement || !soundRef.current)) {
      const firstItem = flatTimeline.items[0];
      if (!firstItem) return;

      // page change
      setIsAutoPageChange(true);
      setCurrentView(firstItem.viewIndex);
      setSelectedThumbnailIndex(firstItem.pageIndex);

      // load audio and play
      await loadAudio(firstItem.element);
      const snd = soundRef.current;
      if (snd) {
        await snd.setPositionAsync(0);
        currentPositionMs.value = 0;
        await snd.playAsync();
        setIsPlaying(true);
        setCurrentAudioElement(firstItem.element);
      }
      setIsAutoPageChange(false);
      return;
    }

    // 2) other toggle (current element)
    if (!soundRef.current && currentAudioElement) {
      await loadAudio(currentAudioElement);
    }
    const sound = soundRef.current;
    if (!sound) return;

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }, [
    currentView,
    currentAudioElement,
    loadAudio,
    flatTimeline,
    setSelectedThumbnailIndex,
    currentPositionMs,
  ]);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TopBar
        title="Review your book"
        titleColor={Colors.white}
        onBackPress={book.prevPath === 'library' ? handleBackPress : undefined}
        rightButtons={
          book.prevPath === 'writer'
            ? [
                {
                  text: 'Publish',
                  href: '/',
                  color: Colors.lightBlue,
                },
              ]
            : []
        }
      />

      {/* page navigation + thumbnail preview */}
      <View style={styles.readerContainer}>
        <ReaderPageSidebar
          pages={book.pages}
          selectedIndex={selectedThumbnailIndex}
          onPressIndex={handleThumbnailPress}
          imageSource={book.coverPageUrl}
        />
        {/* page view */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.pageContainer, animatedStyle]}>
            {renderPageView(currentView)}
          </Animated.View>
        </GestureDetector>
        <View style={styles.zoomButtonContainer}>
        </View>
      </View>

      <View style={styles.pageControls}>
        <IconButton onPress={handlePreviousPage} disabled={selectedThumbnailIndex === 'cover'}>
          <Feather name="rotate-ccw" size={24} color={Colors.white} />
        </IconButton>
        <IconButton onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={Colors.white} />
        </IconButton>
        <IconButton
          onPress={handleNextPage}
          disabled={selectedThumbnailIndex === book.pages.length - 1}
        >
          <Feather name="rotate-cw" size={24} color={Colors.white} />
        </IconButton>
      </View>
    </View>
  );
}
