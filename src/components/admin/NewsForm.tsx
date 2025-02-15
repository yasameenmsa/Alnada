import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNews } from '../../hooks/useNews';
import { Database } from '../../types/supabase';
import { supabase } from '../../services/supabase';
import { Image, Loader, AlertTriangle } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';
import ErrorMessage from '../ErrorMessage';

type NewsInsert = Database['public']['Tables']['news']['Insert'];

const NewsForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { createNews } = useNews();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewsInsert>({
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    category: '',
    image_url: null,
    published: false,
    user_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await createNews({
        ...formData,
        user_id: user.id,
      });
      onSuccess();
      setFormData({
        title_ar: '',
        title_en: '',
        content_ar: '',
        content_en: '',
        category: '',
        image_url: null,
        published: false,
        user_id: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while creating the news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      // Reset the file input
      e.target.value = '';
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'}
          </label>
          <textarea
            required
            rows={4}
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
            rows={4}
            value={formData.content_en}
            onChange={e => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'الصورة' : 'Image'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Image className="h-5 w-5 ml-2" />
            <span>{language === 'ar' ? 'اختر صورة' : 'Choose Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {language === 'ar' 
            ? 'الحد الأقصى للحجم: 10 ميجابايت. الصيغ المدعومة: JPEG, PNG, WebP'
            : 'Max size: 10MB. Supported formats: JPEG, PNG, WebP'}
        </p>
      </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center"
      >
        {loading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          language === 'ar' ? 'إضافة الخبر' : 'Add News'
        )}
      </button>
    </form>
  );
};

export default NewsForm;