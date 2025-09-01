/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */


// Environment Constants
export const BASE_URL = 'http://localhost:80'; //your local ip
// export const BASE_URL = 'https://83724ed9577b.ngrok-free.app'; //your local ip
// export const BASE_URL = 'https://apibeta.ownabee.com';
export const JWT_SECRET = process.env.JWT_SECRET!;
