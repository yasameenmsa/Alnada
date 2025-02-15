import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { uploadToCloudinary } from '../../../services/cloudinary';
import { Image as ImageIcon, Loader, X } from 'lucide-react';
import type { Database } from '../../../types/supabase';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ErrorMessage from '../../../components/ErrorMessage';


type SuccessStoryInsert = Database['public']['Tables']['success_stories']['Insert'] & {
  published: boolean;
  user_id: string;
  location: string;
};

interface SuccessStoryFormData extends SuccessStoryInsert {
  success_details_ar: string;
  success_details_en: string;
  key_takeaways_ar: string;
  key_takeaways_en: string;
  impact_ar: string;
  impact_en: string;
  categories: string[];
  main_image: { url: string; caption: string };
  images: Array<{ url: string; caption: string }>;
  main_video: string | null;
  videos: Array<{ url: string; caption: string }>;
  main_file: string | null;
  files: Array<{ url: string; caption: string }>;
  audience_engagement: string;
}

const INITIAL_FORM_DATA: SuccessStoryFormData = {
  title_ar: '',
  title_en: '',
  content_ar: '',
  content_en: '',
  author_name_ar: '',
  author_name_en: '',
  success_details_ar: '',
  success_details_en: '',
  key_takeaways_ar: '',
  key_takeaways_en: '',
  impact_ar: '',
  impact_en: '',
  start_date: '',
  end_date: '',
  categories: [],
  location: '',
  main_image: { url: '', caption: '' },
  images: [],
  main_video: null,
  videos: [],
  main_file: null,
  files: [],
  audience_engagement: '',
  published: false,
  user_id: '',
};

const MAX_IMAGES = 10;
const MAX_VIDEOS = 5;
const MAX_FILES = 5;

const SuccessStoryForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<SuccessStoryFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title_ar || !formData.title_en || !formData.content_ar ||
          !formData.content_en || !formData.author_name_ar || !formData.author_name_en ||
          !formData.success_details_ar || !formData.success_details_en ||
          !formData.key_takeaways_ar || !formData.key_takeaways_en ||
          !formData.impact_ar || !formData.impact_en || !formData.start_date ||
          !formData.end_date || formData.categories.length === 0 ||
          !formData.location || !formData.main_image.url) {
        throw new Error(language === 'ar' ? 'جميع الحقول المطلوبة والصورة الرئيسية مطلوبة' : 'All required fields and main image must be filled');
      }

      const successStoryData: SuccessStoryInsert = {
        title_ar: formData.title_ar,
        title_en: formData.title_en,
        content_ar: formData.content_ar,
        content_en: formData.content_en,
        author_name_ar: formData.author_name_ar,
        author_name_en: formData.author_name_en,
        success_details_ar: JSON.parse(formData.success_details_ar),
        success_details_en: JSON.parse(formData.success_details_en),
        key_takeaways_ar: JSON.parse(formData.key_takeaways_ar),
        key_takeaways_en: JSON.parse(formData.key_takeaways_en),
        impact_ar: formData.impact_ar,
        impact_en: formData.impact_en,
        start_date: formData.start_date,
        end_date: formData.end_date,
        categories: JSON.parse(formData.categories.join(',')),
        main_image: JSON.parse(JSON.stringify(formData.main_image)),
        images: JSON.parse(JSON.stringify(formData.images)),
        main_video: formData.main_video,
        videos: JSON.parse(JSON.stringify(formData.videos)),
        main_file: formData.main_file,
        files: JSON.parse(JSON.stringify(formData.files)),
        audience_engagement: JSON.parse(formData.audience_engagement),
        location: formData.location,
        published: formData.published,
        user_id: formData.user_id
      };

      const { data, error } = await supabase
        .from('success_stories')
        .insert([successStoryData]);

      if (error) throw error;
      onSuccess();
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }

  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setImageUploading(true);
      setError(null);

      const fileArray = Array.from(files);

      if (formData.images.length + fileArray.length > MAX_IMAGES) {
        throw new Error(
          language === 'ar'
            ? `يمكنك تحميل ${MAX_IMAGES} صور كحد أقصى`
            : `You can upload a maximum of ${MAX_IMAGES} images`
        );
      }

      const uploadPromises = fileArray.map(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            language === 'ar'
              ? 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت'
              : 'File size must not exceed 5MB'
          );
        }

        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
          throw new Error(
            language === 'ar'
              ? 'يجب أن تكون الصورة بصيغة JPG أو PNG أو WebP'
              : 'Image must be in JPG, PNG, or WebP format'
          );
        }

        const imageUrl = await uploadToCloudinary(file);
        return { url: imageUrl, caption: '' };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          ...uploadedImages
        ]
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setVideoUploading(true);
      setError(null);

      const fileArray = Array.from(files);

      if (formData.videos.length + fileArray.length > MAX_VIDEOS) {
        throw new Error(
          language === 'ar'
            ? `يمكنك تحميل ${MAX_VIDEOS} فيديوهات كحد أقصى`
            : `You can upload a maximum of ${MAX_VIDEOS} videos`
        );
      }

      const uploadPromises = fileArray.map(async (file) => {
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(
            language === 'ar'
              ? 'حجم الملف يجب أن لا يتجاوز 50 ميجابايت'
              : 'File size must not exceed 50MB'
          );
        }

        if (!file.type.match(/^video\/(mp4|webm|ogg)$/)) {
          throw new Error(
            language === 'ar'
              ? 'يجب أن يكون الفيديو بصيغة MP4 أو WebM أو Ogg'
              : 'Video must be in MP4, WebM, or Ogg format'
          );
        }

        const videoUrl = await uploadToCloudinary(file);
        return { url: videoUrl, caption: '' };
      });

      const uploadedVideos = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        videos: [
          ...prev.videos,
          ...uploadedVideos
        ]
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload videos');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setFileUploading(true);
      setError(null);

      const fileArray = Array.from(files);

      if (formData.files.length + fileArray.length > MAX_FILES) {
        throw new Error(
          language === 'ar'
            ? `يمكنك تحميل ${MAX_FILES} ملفات كحد أقصى`
            : `You can upload a maximum of ${MAX_FILES} files`
        );
      }

      const uploadPromises = fileArray.map(async (file) => {
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(
            language === 'ar'
              ? 'حجم الملف يجب أن لا يتجاوز 50 ميجابايت'
              : 'File size must not exceed 50MB'
          );
        }

        const fileUrl = await uploadToCloudinary(file);
        return { url: fileUrl, caption: '' };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        files: [
          ...prev.files,
          ...uploadedFiles
        ]
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setFileUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {error && <ErrorMessage message={error} />}

        {/* Form fields for success story details */}
        {/* ... (rest of the form fields) */}

        {/* Images Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الصور' : 'Images'}*
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <ImageIcon className="h-5 w-5 ml-2" />
                <span>
                  {language === 'ar' ? 'اختر صوراً' : 'Choose Images'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  multiple
                  className="hidden"
                  disabled={formData.images.length >= MAX_IMAGES}
                />
              </label>
              {imageUploading && <Loader className="h-5 w-5 ml-4 animate-spin" />}
            </div>

            {/* Images Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Success story image ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      title={language === 'ar' ? 'حذف الصورة' : 'Remove image'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {language === 'ar'
                ? `يمكنك تحميل حتى ${MAX_IMAGES} صور. الحد الأقصى للحجم: 5 ميجابايت لكل صورة`
                : `You can upload up to ${MAX_IMAGES} images. Max size: 5MB per image`}
            </p>
          </div>
        </div>

        {/* Videos Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الفيديوهات' : 'Videos'}*
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <ImageIcon className="h-5 w-5 ml-2" />
                <span>
                  {language === 'ar' ? 'اختر فيديوهات' : 'Choose Videos'}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  multiple
                  className="hidden"
                  disabled={formData.videos.length >= MAX_VIDEOS}
                />
              </label>
              {videoUploading && <Loader className="h-5 w-5 ml-4 animate-spin" />}
            </div>

            {/* Videos Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.videos.map((video, index) => (
                <div key={index} className="relative group">
                  <video
                    src={video.url}
                    className="h-24 w-24 object-cover rounded-lg"
                    controls
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="p-1 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      title={language === 'ar' ? 'حذف الفيديو' : 'Remove video'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {language === 'ar'
                ? `يمكنك تحميل حتى ${MAX_VIDEOS} فيديوهات. الحد الأقصى للحجم: 50 ميجابايت لكل فيديو`
                : `You can upload up to ${MAX_VIDEOS} videos. Max size: 50MB per video`}
            </p>
          </div>
        </div>

        {/* Files Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الملفات' : 'Files'}*
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <ImageIcon className="h-5 w-5 ml-2" />
                <span>
                  {language === 'ar' ? 'اختر ملفات' : 'Choose Files'}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  disabled={formData.files.length >= MAX_FILES}
                />
              </label>
              {fileUploading && <Loader className="h-5 w-5 ml-4 animate-spin" />}
            </div>

            {/* Files Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.files.map((file, index) => (
                <div key={index} className="relative group">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-lg text-gray-700"
                  >
                    {language === 'ar' ? 'ملف' : 'File'}
                  </a>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      title={language === 'ar' ? 'حذف الملف' : 'Remove file'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {language === 'ar'
                ? `يمكنك تحميل حتى ${MAX_FILES} ملفات. الحد الأقصى للحجم: 50 ميجابايت لكل ملف`
                : `You can upload up to ${MAX_FILES} files. Max size: 50MB per file`}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || imageUploading || videoUploading || fileUploading}
          className="w-full"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            language === 'ar' ? 'إنشاء قصة نجاح' : 'Create Success Story'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SuccessStoryForm;