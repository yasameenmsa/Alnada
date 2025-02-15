import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEvents } from '../../hooks/useEvents';
import { supabase } from '../../services/supabase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Calendar, Clock, MapPin, Users, Image as ImageIcon, Loader, X } from 'lucide-react';
import type { Database, Json } from '../../types/supabase';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ErrorMessage from '../ErrorMessage';

type EventInsert = Database['public']['Tables']['events']['Insert'] & { image_url: string | null };

interface EventFormData extends Omit<EventInsert, 'user_id'> {
  end_time: string;
  capacity: number | null;
  price: string;
  photos: Array<{ url: string; isMain: boolean }>;
  image_url: string | null; // Add image_url property
  main_image_url: string | null; // Add main_image_url property
  additional_images: Json; // Add additional_images property
}

const INITIAL_FORM_DATA: EventFormData = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  event_date: '',
  end_time: '',
  location_ar: '',
  location_en: '',
  image_url: null,
  main_image_url: null,
  additional_images: [],
  photos: [],
  capacity: null,
  price: 'free',
  published: false,
};

const MAX_PHOTOS = 10;

const CreateEventForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { language, t } = useLanguage();
  const { createEvent } = useEvents();
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title_ar || !formData.title_en || !formData.description_ar ||
          !formData.description_en || !formData.event_date || !formData.location_ar ||
          !formData.location_en || formData.photos.length === 0) {
        throw new Error(language === 'ar' ? 'جميع الحقول المطلوبة والصورة الرئيسية مطلوبة' : 'All required fields and main image must be filled');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the main photo URL
      const mainPhoto = formData.photos.find(photo => photo.isMain);
      if (!mainPhoto) {
        throw new Error(language === 'ar' ? 'يجب تحديد صورة رئيسية' : 'A main image must be selected');
      }

      // Combine date and time
      const eventDateTime = new Date(formData.event_date);
      const [hours, minutes] = formData.end_time.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      const eventData: EventInsert = {
        title_ar: formData.title_ar,
        title_en: formData.title_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        event_date: eventDateTime.toISOString(),
        location_ar: formData.location_ar,
        location_en: formData.location_en,
        image_url: mainPhoto.url, // Set the main photo as image_url
        main_image_url: mainPhoto.url, // Set the main photo as main_image_url
        additional_images: formData.photos.filter(photo => !photo.isMain).map(photo => photo.url),
        published: formData.published,
        user_id: user.id,
      };

      await createEvent(eventData);
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

      // Convert FileList to Array for easier handling
      const fileArray = Array.from(files);

      // Check if adding new files would exceed the limit
      if (formData.photos.length + fileArray.length > MAX_PHOTOS) {
        throw new Error(
          language === 'ar'
            ? `يمكنك تحميل ${MAX_PHOTOS} صور كحد أقصى`
            : `You can upload a maximum of ${MAX_PHOTOS} photos`
        );
      }

      // Upload each file
      const uploadPromises = fileArray.map(async (file) => {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            language === 'ar'
              ? 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت'
              : 'File size must not exceed 5MB'
          );
        }

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
          throw new Error(
            language === 'ar'
              ? 'يجب أن تكون الصورة بصيغة JPG أو PNG أو WebP'
              : 'Image must be in JPG, PNG, or WebP format'
          );
        }

        const imageUrl = await uploadToCloudinary(file);
        return imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Add new photos to the state
      setFormData(prev => ({
        ...prev,
        photos: [
          ...prev.photos,
          ...uploadedUrls.map(url => ({
            url,
            isMain: prev.photos.length === 0 // Make first photo main if no photos exist
          }))
        ]
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setImageUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const setMainPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => ({
        ...photo,
        isMain: i === index
      }))
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const newPhotos = prev.photos.filter((_, i) => i !== index);
      // If we removed the main photo and there are other photos, make the first one main
      if (prev.photos[index].isMain && newPhotos.length > 0) {
        newPhotos[0].isMain = true;
      }
      return {
        ...prev,
        photos: newPhotos
      };
    });
  };

  // ... (previous form fields code remains the same until the photos section)

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {error && <ErrorMessage message={error} />}

        {/* Previous form fields remain the same */}
        {/* ... */}

        {/* Photos Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الصور' : 'Photos'}*
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <ImageIcon className="h-5 w-5 ml-2" />
                <span>
                  {language === 'ar' ? 'اختر صوراً' : 'Choose Photos'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  multiple
                  className="hidden"
                  disabled={formData.photos.length >= MAX_PHOTOS}
                />
              </label>
              {imageUploading && <Loader className="h-5 w-5 ml-4 animate-spin" />}
            </div>

            {/* Photos Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.url}
                    alt={`Event photo ${index + 1}`}
                    className={`h-24 w-24 object-cover rounded-lg ${
                      photo.isMain ? 'ring-2 ring-primary' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setMainPhoto(index)}
                      className={`p-1 rounded-full ${
                        photo.isMain ? 'bg-primary text-white' : 'bg-white text-gray-700'
                      } hover:bg-primary hover:text-white`}
                      title={language === 'ar' ? 'تعيين كصورة رئيسية' : 'Set as main photo'}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="p-1 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      title={language === 'ar' ? 'حذف الصورة' : 'Remove photo'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {photo.isMain && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      {language === 'ar' ? 'رئيسية' : 'Main'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {language === 'ar'
                ? `يمكنك تحميل حتى ${MAX_PHOTOS} صور. الحد الأقصى للحجم: 5 ميجابايت لكل صورة`
                : `You can upload up to ${MAX_PHOTOS} photos. Max size: 5MB per photo`}
            </p>
          </div>
        </div>

        {/* Rest of the form remains the same */}
        {/* ... */}

        <Button
          type="submit"
          disabled={loading || imageUploading}
          className="w-full"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            language === 'ar' ? 'إنشاء الفعالية' : 'Create Event'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateEventForm;