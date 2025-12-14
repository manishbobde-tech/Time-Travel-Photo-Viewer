export interface Era {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  color: string;
}

export interface GeneratedImage {
  id: string;
  originalImage: string; // base64
  resultImage: string | null; // base64
  era: Era;
  timestamp: number;
  analysis?: string;
}

export type AppState = 'HOME' | 'CAPTURE' | 'SELECT_ERA' | 'PROCESSING' | 'RESULT';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}