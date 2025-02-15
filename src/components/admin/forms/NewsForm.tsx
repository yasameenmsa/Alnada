import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useNews } from '../../../hooks/useNews';
import { uploadToCloudinary } from '../../../services/cloudinary';
import { Image, Loader, X } from 'lucide-react';
import Button from '../../ui/Button';
import ErrorMessage from '../../ErrorMessage';
import type { Database } from '../../../types/supabase';

type NewsInsert = Database['public']['Tables']['news']['Insert'];

interface NewsFormProps {
  onSuccess: () => void;
  initialData?: NewsInsert;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess, initialData }) => {
  const { language } = useLanguage();
  const { createNews, updateNews } = useNews();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewsInsert>(
    initialData || {
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      main_image_url: null,
      additional_images: [],
      category: '',
      published: false,
      user_id: ''
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);

      if (!formData.main_image_url) {
        throw new Error(language === 'ar' ? 'الصورة الرئيسية مطلوبة' : 'Main image is required');
      }

      const result = initialData 
        ? await updateNews(initialData.id!, formData)
        : await createNews(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isMain) {
        setFormData(prev => ({
          ...prev,
          main_image_url: uploadedUrls[0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          additional_images: [...(prev.additional_images || []), ...uploadedUrls]
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number, isMain: boolean = false) => {
    if (isMain) {
      setFormData(prev => ({
        ...prev,
        main_image_url: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        additional_images: prev.additional_images?.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}

      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
          </label>
          <input
            type="text"
            required
            value={formData.title_ar}
            onChange={e => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
          </label>
          <input
            type="text"
            required
            value={formData.title_en}
            onChange={e => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'}
          </label>
          <textarea
            required
            rows={6}
            value={formData.content_ar}
            onChange={e => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'}
          </label>
          <textarea
            required
            rows={6}
            value={formData.content_en}
            onChange={e => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'التصنيف' : 'Category'}
        </label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
            onChange={e => handleImageUpload(e, true)}
            className="hidden"
          />
          {formData.main_image_url && (
            <div className="relative">
              <img
                src={formData.main_image_url}
                alt="Main"
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(0, true)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="grid grid-cols-4 gap-4 mt-4">
          {formData.additional_images?.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Additional ${index + 1}`}
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          {language === 'ar' ? 'نشر الخبر' : 'Publish News'}
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          language === 'ar' ? 'حفظ' : 'Save'
        )}
      </Button>
    </form>
  );
};

export default NewsForm;