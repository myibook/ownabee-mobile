// utils/axiosInstance.ts
import { tokenCache } from "@/utils/cache";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];
let onSignOut: (() => void) | null = null;

export const setSignOutHandler = (handler: () => void) => {
  onSignOut = handler;
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!tokenCache) {
      throw new Error("tokenCache is not initialized");
    }

    const token = await tokenCache.getToken("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (!tokenCache) {
          throw new Error("tokenCache is not initialized");
        }
        const refreshToken = await tokenCache.getToken("refreshToken");
        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          platform: "native",
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        await tokenCache.saveToken("accessToken", newAccessToken);
        await tokenCache.saveToken("refreshToken", newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        if (onSignOut) {
          onSignOut(); // 자동 로그아웃 실행
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
