export type AudioBook = {
  id: string;
  title: string;
  createdAt: string;
  cover?: string;
};

export type PageThumbnailProps = {
  content: PageData;
  isSelected: boolean;
  onPress: () => void;
};

export type PageData = {
  text: string;
  layout: string;
  pageNum: number;
  image?: string;
  id?: string;
};

export type AudioBookDetail = {
  id: string;
  title: string;
  createdBy: string;
  readingLevel: string;
  summary: string;
  cover: string;
  pageCount: number;
};
