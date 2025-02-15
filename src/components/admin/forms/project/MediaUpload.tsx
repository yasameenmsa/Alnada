import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import UploadImage from './UploadImage';
import UploadVideo from './UploadVideo';
import UploadFile from './UploadFile';

interface MediaFile {
  url: string;
  uploaded_at: string;
  caption_ar?: string;
  caption_en?: string;
  description_ar?: string;
  description_en?: string;
}

interface MediaUploadProps {
  mainImage: MediaFile;
  images: MediaFile[];
  mainVideo: MediaFile;
  videos: MediaFile[];
  mainFile: MediaFile;
  files: MediaFile[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onRemoveImage: (index: number, isMain?: boolean) => void;
  onRemoveVideo: (index: number, isMain?: boolean) => void;
  onRemoveFile: (index: number, isMain?: boolean) => void;
  onUpdateCaption?: (type: 'image' | 'video', index: number, lang: 'ar' | 'en', value: string) => void;
  onUpdateDescription?: (index: number, lang: 'ar' | 'en', value: string) => void;
  loading: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mainImage,
  images,
  mainVideo,
  videos,
  mainFile,
  files,
  onImageUpload,
  onVideoUpload,
  onFileUpload,
  onRemoveImage,
  onRemoveVideo,
  onRemoveFile,
  onUpdateCaption,
  onUpdateDescription,
  loading,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'الوسائط' : 'Media'}
      </h2>

      <UploadImage
        mainImage={mainImage}
        images={images}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        onUpdateCaption={onUpdateCaption}
        loading={loading}
      />

      <UploadVideo
        mainVideo={mainVideo}
        videos={videos}
        onVideoUpload={onVideoUpload}
        onRemoveVideo={onRemoveVideo}
        onUpdateCaption={onUpdateCaption}
        loading={loading}
      />

      <UploadFile
        mainFile={mainFile}
        files={files}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
        onUpdateDescription={onUpdateDescription}
        loading={loading}
      />
    </div>
  );
};

export default MediaUpload;
