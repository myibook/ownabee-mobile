/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */

import { Platform } from "react-native";

// Environment Constants
export const BASE_URL = "http://127.0.0.1:80"; //your local ip
export const JWT_SECRET = process.env.JWT_SECRET!;

export const backendBaseUrl =
  Platform.OS === "android" ? "http://10.0.2.2:80" : "http://127.0.0.1:80";
// export const backendBaseUrl = 'https://api.sorisori.ai';
// export const backendBaseUrl = 'https://apibeta.sorisori.ai';
