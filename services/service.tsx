import { Page, TextData } from '@/types/audiobook';
import { axiosInstance } from '@/utils/axiosInstance';

export type GeneratedCharacter = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  token_usage?: any;
  cost?: number;
};

export const fetchAudioBooks = async () => {
  const res = await axiosInstance.get(`/api/audiobooks`);
  return res.data;
};

export const saveTextsToServer = async (texts: TextData[], signal?: AbortSignal) => {
  const res = await axiosInstance.post(`/api/audiobooks/page-texts`, { texts }, { signal });
  return res.data.texts;
};

export const createBook = async (title: string, genre: string) => {
  const response = await axiosInstance.post(`/api/audiobooks`, { title });
  return response.data;
};

export const deleteText = async (pageId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/audiobooks/page-texts/${pageId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error('Failed to delete page');
    }
  } catch (error) {
    console.error('❌ delete Page error:', error);
    return null;
  }
};

export const fetchAudioBookDetail = async (id: string) => {
  const res = await axiosInstance.get(`/api/audiobooks/${id}`);
  return res.data;
};

export const checkGrammar = async (text: string) => {
  const response = await axiosInstance.post(`/api/grammar/check`, { text });
  return response.data;
};

export const updateGrammarCorrectedText = async (textId: string, correctedText: string) => {
  await axiosInstance.put(`/api/audiobooks/page-texts/grammar`, {
    textId,
    correctedText,
  });
  console.log('✅ grammar corrected text saved!');
};

export const fetchTextsByEditionId = async (editionId: string): Promise<TextData[]> => {
  const response = await axiosInstance.get(`/api/audiobooks/page-texts/by-edition/${editionId}`);
  return response.data;
};

export const savePagesLayout = async (editionId: string, pages: Page[]): Promise<void> => {
  await axiosInstance.patch(`/api/audiobooks/editions/${editionId}/pages`, pages);
};

export const generateTranscript = async (editionId: string, ttsVoiceId: string) => {
  const response = await axiosInstance.post(`/api/audiobooks/page-tts/generate-tts`, {
    editionId,
    ttsVoiceId,
  });
  return response.data;
};

export const fetchEditionWithTranscript = async (editionId: string, ttsVoiceId: string) => {
  const response = await axiosInstance.get(
    `/api/audiobooks/editions/${editionId}/with-tts?ttsVoiceId=${ttsVoiceId}`
  );
  return response.data;
};

export const createCover = async (audioBookEditionId: string, components: any, uri: string) => {
  const formData = new FormData();
  formData.append('audioBookEditionId', audioBookEditionId);
  formData.append('components', JSON.stringify(components));
  formData.append('file', {
    uri,
    name: 'screenshot.png',
    type: 'image/png',
  } as any);

  const response = await axiosInstance.post(`/api/audiobooks/covers`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const generateCharactersForEdition = async (
  params: { storyText: string } | { audioBookEditionId: string }
) => {
  const res = await axiosInstance.post(`/api/storyimages/generate-characters`, params);
  return res.data as { characterUids: string[]; characters: GeneratedCharacter[] };
};

export const generateImageWithCharacters = async (
  characterUids: string[],
  prompt: string,
  opts?: { attachToPageId?: string; audioBookEditionId?: string; ratio?: string; pageTextId?: string }
) => {
  const res = await axiosInstance.post(`/api/storyimages/generate-image-with-characters`, {
    characterUids,
    prompt,
    ...opts,
  });
  return res.data as { sceneImageUrl: string; pageImageId?: string; pageTextImageId?: string; editionImageId?: string };
};

export const fetchEditionImages = async (editionId: string) => {
  const res = await axiosInstance.get(`/api/storyimages/editions/${editionId}/images`);
  return res.data as { id: string; url: string; order: number }[];
};

export const fetchPageTextImages = async (pageTextId: string) => {
  const res = await axiosInstance.get(`/api/storyimages/page-texts/${pageTextId}/images`);
  return res.data as { id: string; url: string; order: number }[];
};
