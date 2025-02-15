import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEvents } from '../../hooks/useEvents';
import { Database } from '../../types/supabase';
import { supabase } from '../../services/supabase';
import { Image, Loader } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';

// Update the EventInsert type to include images and main_image
type EventInsert = Database['public']['Tables']['events']['Insert'] & {
  images: string[]; // Array of image URLs
  main_image: string | null; // Main image URL
};

const EventForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventInsert>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    event_date: '',
    location_ar: '',
    location_en: '',
    images: [], // Array to store multiple image URLs
    main_image: null, // Main image URL
    published: false,
    user_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await createEvent({
        ...formData,
        user_id: user.id,
      });
      
      // Call onSuccess to close the popup
      onSuccess();
      
      // Reset form data
      setFormData({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        event_date: '',
        location_ar: '',
        location_en: '',
        images: [],
        main_image: null,
        published: false,
        user_id: '',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);
      const images = await Promise.all(
        Array.from(files).map(async (file) => {
          const imageUrl = await uploadToCloudinary(file);
          return imageUrl;
        })
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      main_image: imageUrl,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
          </label>
          <textarea
            required
            rows={4}
            value={formData.description_ar}
            onChange={(e) => setFormData((prev) => ({ ...prev, description_ar: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
          </label>
          <textarea
            required
            rows={4}
            value={formData.description_en}
            onChange={(e) => setFormData((prev) => ({ ...prev, description_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Event Date and Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'تاريخ الفعالية' : 'Event Date'}
          </label>
          <input
            type="datetime-local"
            required
            value={formData.event_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الموقع (عربي)' : 'Location (Arabic)'}
          </label>
          <input
            type="text"
            required
            value={formData.location_ar}
            onChange={(e) => setFormData((prev) => ({ ...prev, location_ar: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Location (English) Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'الموقع (إنجليزي)' : 'Location (English)'}
        </label>
        <input
          type="text"
          required
          value={formData.location_en}
          onChange={(e) => setFormData((prev) => ({ ...prev, location_en: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Multiple Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'الصور' : 'Images'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Image className="h-5 w-5 ml-2" />
            <span>{language === 'ar' ? 'اختر صور' : 'Choose Images'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleMultipleImageUpload}
              className="hidden"
            />
          </label>
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleSetMainImage(imageUrl)}
                    className={`absolute top-1 right-1 p-1 rounded-full ${
                      formData.main_image === imageUrl ? 'bg-green-500' : 'bg-gray-500'
                    } text-white`}
                  >
                    {formData.main_image === imageUrl ? '✓' : '★'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publish Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          {language === 'ar' ? 'نشر الفعالية' : 'Publish Event'}
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center"
      >
        {loading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          language === 'ar' ? 'إضافة الفعالية' : 'Add Event'
        )}
      </button>
    </form>
  );
};

export default EventForm;