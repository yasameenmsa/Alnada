export enum FileType {
  Image = 'image',
  Document = 'document',
  Video = 'video',
}

export interface UploadedFile {
  preview: string;
  file: File;
  type: FileType;
}

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
}