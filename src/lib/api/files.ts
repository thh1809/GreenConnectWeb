import { post } from './client';

export interface UploadUrlRequest {
  fileName: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  filePath: string;
}

export const files = {
  getScrapCategoryUploadUrl: (data: UploadUrlRequest): Promise<UploadUrlResponse> => {
    return post<UploadUrlResponse>('/api/v1/files/upload-url/scrap-category', data);
  },

  uploadBinaryToUrl: async (uploadUrl: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('uploadUrl', uploadUrl);
    formData.append('contentType', file.type || 'application/octet-stream');
    formData.append('file', file);

    const res = await fetch('/api/upload-proxy', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const details = await res.text().catch(() => '');
      throw new Error(`Upload Error: ${res.status} - ${res.statusText}. ${details}`);
    }
  },
};
