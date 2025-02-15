import React, { useState } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Image, X, CheckCircle } from 'lucide-react';
import Button from '../../../ui/Button';

interface MediaFile {
  url: string;
  uploaded_at: string;
  caption_ar?: string;
  caption_en?: string;
}

interface UploadImageProps {
  mainImage: MediaFile;
  images: MediaFile[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onRemoveImage: (index: number, isMain?: boolean) => void;
  onUpdateCaption?: (type: 'image', index: number, lang: 'ar' | 'en', value: string) => void;
  loading: boolean;
  error?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  mainImage,
  images,
  onImageUpload,
  onRemoveImage,
  onUpdateCaption,
  loading,
}) => {
  const { language } = useLanguage();
  const [uploadProgress, setUploadProgress] = useState<number>(0); // State to track upload progress

  // Modified onImageUpload function to track progress
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate progress (replace this with actual upload logic)
    const totalSize = file.size;
    let uploadedSize = 0;

    const interval = setInterval(() => {
      uploadedSize += 1024 * 1024; // Simulate 1MB chunks
      const progress = Math.min((uploadedSize / totalSize) * 100, 100);
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0); // Reset progress after upload
      }
    }, 100);

    await onImageUpload(e, isMain); // Call the original onImageUpload function
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'ar' ? 'الصور' : 'Images'}
      </h3>

      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}*
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('mainImage')?.click()}
            disabled={loading}
          >
            <Image className="h-5 w-5 ml-2" />
            {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
          </Button>
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, true)}
            className="hidden"
          />
          {mainImage.url && (
            <div className="relative">
              <img
                src={mainImage.url}
                alt="Main"
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(0, true)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
              <CheckCircle className="absolute -bottom-2 -right-2 h-5 w-5 text-green-500 bg-white rounded-full" />
            </div>
          )}
        </div>
        {/* Progress Bar for Main Image */}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'صور إضافية' : 'Additional Images'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('additionalImages')?.click()}
            disabled={loading}
          >
            <Image className="h-5 w-5 ml-2" />
            {language === 'ar' ? 'اختر صور' : 'Choose Images'}
          </Button>
          <input
            id="additionalImages"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            className="hidden"
          />
        </div>
        {/* Progress Bar for Additional Images */}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={`Additional ${index + 1}`}
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
              {onUpdateCaption && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={image.caption_ar || ''}
                    onChange={(e) => onUpdateCaption('image', index, 'ar', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (عربي)' : 'Caption (Arabic)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    value={image.caption_en || ''}
                    onChange={(e) => onUpdateCaption('image', index, 'en', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (إنجليزي)' : 'Caption (English)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;