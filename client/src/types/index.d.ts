declare global {
  interface SpotifyApiError {
    status: number;
    message: string;
  }
}

export {};
