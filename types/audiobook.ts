export type AudioBook = {
  id: string;
  title: string;
  createdAt: string;
  pageCount: number;
  editionId?: string;
  cover?: string;
  coverPageUrl?: string;
};

export type PageThumbnailProps = {
  content: TextData;
  isSelected: boolean;
  onPress: () => void;
};

export type ReaderData = {
  id: string;
  title: string;
  pages: Page[];
  coverPageUrl?: string;
  prevPath?: 'writer' | 'library';
};

export type Page = {
  id: string;
  items: CanvasItem[];
};

export type TextData = {
  id?: string;
  audioBookEditionId: string;
  content?: string;
  order: number;
  image?: string;
  grammarCorrectedText?: string;
  originalText?: string;
};

export type AudioBookDetail = {
  id: string;
  title: string;
  createdBy: string;
  readingLevel: string;
  summary: string;
  cover: string;
  editionId?: string;
  pageCount: number;
  coverPageUrl: string;
};

export type LayoutStyleKey =
  | 'imageTopTextBottom'
  | 'imageLeftTextRight'
  | 'textLeftImageRight'
  | 'imageLeftTextRightVert';

export type GrammarCheckStatus = {
  pageId: string;
  checked: boolean;
  status: GrammarCheckProgress;
  originalText: string;
};

export type GrammarCheckResult = {
  grammar_fixes?: any[];
};

export enum GrammarCheckProgress {
  Idle = 'idle',
  Checking = 'checking',
  Done = 'done',
}

export type CanvasTextItem = {
  order: number;
  id: string;
  originalTextId: string;
  type: 'text';
  // Static index that identifies a text/image pair on a page
  pairIndex?: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  baseFontSize: number;
  minFontSize: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  audioUrl?: string;
  transcript?: TranscriptWord[];
};

export type CanvasImageItem = {
  id: string;
  type: 'image';
  linkedTextId: string;
  // Static index that identifies a text/image pair on a page
  pairIndex?: number;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  imageUrl?: string;
};

export type TranscriptWord = {
  word: string;
  startMs: number;
  endMs: number;
};

export type FlatItem = {
  element: CanvasTextItem;
  pageIndex: number;
  viewIndex: number;
  startMs: number;
  endMs: number;
  durationMs: number;
};

export type CanvasItem = CanvasTextItem | CanvasImageItem;
