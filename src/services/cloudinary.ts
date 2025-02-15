import { FileType } from '../types';

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  folder: 'nada_foundation',
};

if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.apiKey || !CLOUDINARY_CONFIG.apiSecret) {
  throw new Error('Missing Cloudinary environment variables');
}

export const MAX_FILE_SIZE: { [K in FileType]: number } = {
  [FileType.Image]: 100 * 1024 * 1024,    // 100MB
  [FileType.Document]: 100 * 1024 * 1024, // 100MB
  [FileType.Video]: 1024 * 1024 * 1024,   // 1GB
};

export const ALLOWED_FILE_TYPES: { [K in FileType]: string[] } = {
  [FileType.Image]: ['image/jpeg', 'image/png', 'image/webp'],
  [FileType.Document]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  [FileType.Video]: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/webm',
    'video/mpeg',
    'video/ogv',
  ],
};

async function generateSignature(params: Record<string, string>): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + CLOUDINARY_CONFIG.apiSecret;

  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function uploadToCloudinary(file: File, type: FileType = FileType.Image): Promise<string> {
  validateFileType(file, type);
  validateFileSize(file, type);

  const timestamp = Math.round(Date.now() / 1000).toString();
  const resourceType = getResourceType(type);
  
  const params = {
    timestamp,
    folder: CLOUDINARY_CONFIG.folder,
  };

  const signature = await generateSignature(params);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', CLOUDINARY_CONFIG.folder);
  formData.append('signature', signature);

  const endpoint = getUploadEndpoint(CLOUDINARY_CONFIG.cloudName, resourceType);
  return performUpload(endpoint, formData);
}

function validateFileType(file: File, type: FileType): void {
  const allowedTypes = ALLOWED_FILE_TYPES[type];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

function validateFileSize(file: File, type: FileType): void {
  const maxSize = MAX_FILE_SIZE[type];
  if (file.size > maxSize) {
    const sizeInMB = maxSize / (1024 * 1024);
    throw new Error(`File size exceeds ${sizeInMB}MB limit`);
  }
}

function getResourceType(type: FileType): string {
  return type === FileType.Document ? 'raw' : type.toLowerCase();
}

function getUploadEndpoint(cloudName: string, resourceType: string): string {
  return `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
}

async function performUpload(endpoint: string, formData: FormData): Promise<string> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error details:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    if (!data.secure_url) {
      console.error('Missing secure_url in response:', data);
      throw new Error('No URL received from Cloudinary');
    }
    return data.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Upload error:', error);
      throw new Error(`Upload error: ${error.message}`);
    }
    throw new Error('Upload failed with unknown error');
  }
}