import { axiosInstance } from '@/utils/axiosInstance';

export const fetchVoices = async () => {
  const res = await axiosInstance.get(`/api/tts/voices`);
  return res.data;
};

export const fetchVoicesWithReadyStatus = async (editionId: string) => {
  const res = await axiosInstance.get(`/api/tts/voices/with-ready-status?editionId=${editionId}`);
  return res.data;
};

export const uploadVoice = async (voiceName: string, files: File[]) => {
  const formData = new FormData();
  formData.append('modelName', voiceName);
  files.forEach(file => {
    formData.append('files', file);
  });

  const res = await axiosInstance.post(`/api/tts/voices`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
