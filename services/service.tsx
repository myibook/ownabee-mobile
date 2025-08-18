import { PageData } from "@/types/audiobook";
import { axiosInstance } from "@/utils/axiosInstance";

export const fetchAudioBooks = async () => {
  const res = await axiosInstance.get(`/api/audiobooks`);
  return res.data;
};

export const savePagesToServer = async (pages: PageData[]) => {
  const res = await axiosInstance.post(`/api/audiobooks/page-texts`, { pages });
  return res.data;
};

export const createBook = async (title: string, genre: string) => {
  const response = await axiosInstance.post(`/api/audiobooks`, { title });
  return response.data;
};

export const createPage = async (
  audioBookEditionId: string,
  pageNum: number,
  layout: string
) => {
  try {
    const response = await axiosInstance.post(`/api/audiobooks/pages`, {
      audioBookEditionId,
      pageNum,
      layoutType: layout,
    });
    if (!response.data.id) {
      console.error("Failed to create Page");
      return;
    }
    return response.data;
  } catch (error) {
    console.error("❌ createPage error:", error);
    return null;
  }
};

export const deletePage = async (pageId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/audiobooks/pages/${pageId}`
    );
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete page");
    }
  } catch (error) {
    console.error("❌ delete Page error:", error);
    return null;
  }
};

export const fetchAudioBookDetail = async (id: string) => {
  const res = await axiosInstance.get(`/api/audiobooks/${id}`);
  return res.data;
};
