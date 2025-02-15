import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useReports } from '../../../hooks/useReports';
import { uploadToCloudinary } from '../../../services/cloudinary';
import { Image, Loader, X, FileText } from 'lucide-react';
import Button from '../../ui/Button';
import ErrorMessage from '../../ErrorMessage';
import type { Database } from '../../../types/supabase';
import { supabase } from '../../../services/supabase';

type ReportInsert = Database['public']['Tables']['reports']['Insert'];

interface ReportFormProps {
  onSuccess: () => void;
  initialData?: ReportInsert;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSuccess, initialData }) => {
  const { language } = useLanguage();
  const { createReport, updateReport } = useReports();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    file?: boolean;
    main?: boolean;
    additional?: boolean;
  }>({});
  const [formData, setFormData] = useState<ReportInsert>({
    title_ar: initialData?.title_ar || '',
    title_en: initialData?.title_en || '',
    description_ar: initialData?.description_ar || '',
    description_en: initialData?.description_en || '',
    file_url: initialData?.file_url || '',
    file_size: initialData?.file_size || '',
    report_type: initialData?.report_type || '',
    main_image_url: initialData?.main_image_url || null,
    additional_images: initialData?.additional_images || [],
    published: initialData?.published || false,
    user_id: initialData?.user_id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title_ar?.trim()) {
        throw new Error(language === 'ar' ? 'العنوان بالعربية مطلوب' : 'Arabic title is required');
      }
      if (!formData.title_en?.trim()) {
        throw new Error(language === 'ar' ? 'العنوان بالإنجليزية مطلوب' : 'English title is required');
      }
      if (!formData.description_ar?.trim()) {
        throw new Error(language === 'ar' ? 'الوصف بالعربية مطلوب' : 'Arabic description is required');
      }
      if (!formData.description_en?.trim()) {
        throw new Error(language === 'ar' ? 'الوصف بالإنجليزية مطلوب' : 'English description is required');
      }
      if (!formData.report_type?.trim()) {
        throw new Error(language === 'ar' ? 'نوع التقرير مطلوب' : 'Report type is required');
      }
      if (!formData.file_url) {
        throw new Error(language === 'ar' ? 'ملف التقرير مطلوب' : 'Report file is required');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Prepare data for submission
      const reportData: ReportInsert = {
        ...formData,
        user_id: user.id,
        additional_images: formData.additional_images || [], // Ensure it's an array
      };

      const result = initialData 
        ? await updateReport(initialData.id!, reportData)
        : await createReport(reportData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save report');
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(prev => ({ ...prev, file: true }));

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(language === 'ar' 
          ? 'حجم الملف يجب أن لا يتجاوز 10 ميجابايت'
          : 'File size must not exceed 10MB'
        );
      }

      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!allowedTypes.includes(fileExtension)) {
        throw new Error(language === 'ar'
          ? 'نوع الملف غير مدعوم. الأنواع المدعومة: PDF, DOC, DOCX'
          : 'Unsupported file type. Supported types: PDF, DOC, DOCX'
        );
      }

      const fileUrl = await uploadToCloudinary(file, 'document');
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      setFormData(prev => ({
        ...prev,
        file_url: fileUrl,
        file_size: fileSize
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
      setUploadProgress(prev => ({ ...prev, file: false }));
      e.target.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(prev => ({
        ...prev,
        [isMain ? 'main' : 'additional']: true
      }));

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
      setUploadProgress(prev => ({
        ...prev,
        [isMain ? 'main' : 'additional']: false
      }));
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
        additional_images: prev.additional_images?.filter((_, i) => i !== index) || []
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
            {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}*
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
            {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}*
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

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}*
          </label>
          <textarea
            required
            rows={6}
            value={formData.description_ar}
            onChange={e => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}*
          </label>
          <textarea
            required
            rows={6}
            value={formData.description_en}
            onChange={e => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'نوع التقرير' : 'Report Type'}*
        </label>
        <input
          type="text"
          required
          value={formData.report_type}
          onChange={e => setFormData(prev => ({ ...prev, report_type: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'ملف التقرير' : 'Report File'}*
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('reportFile')?.click()}
            disabled={loading || uploadProgress.file}
            className="relative"
          >
            {uploadProgress.file ? (
              <Loader className="h-5 w-5 ml-2 animate-spin" />
            ) : (
              <FileText className="h-5 w-5 ml-2" />
            )}
            {language === 'ar' ? 'اختر ملف' : 'Choose File'}
          </Button>
          <input
            id="reportFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          {formData.file_url && (
            <div className="flex items-center text-sm">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {language === 'ar' ? 'عرض الملف' : 'View File'}
              </a>
              <span className="mx-2">•</span>
              <span className="text-gray-600">{formData.file_size}</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {language === 'ar'
            ? 'الحد الأقصى للحجم: 10 ميجابايت. الصيغ المدعومة: PDF, DOC, DOCX'
            : 'Max size: 10MB. Supported formats: PDF, DOC, DOCX'}
        </p>
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('mainImage')?.click()}
            disabled={loading || uploadProgress.main}
            className="relative"
          >
            {uploadProgress.main ? (
              <Loader className="h-5 w-5 ml-2 animate-spin" />
            ) : (
              <Image className="h-5 w-5 ml-2" />
            )}
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
            disabled={loading || uploadProgress.additional}
            className="relative"
          >
            {uploadProgress.additional ? (
              <Loader className="h-5 w-5 ml-2 animate-spin" />
            ) : (
              <Image className="h-5 w-5 ml-2" />
            )}
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
          {language === 'ar' ? 'نشر التقرير' : 'Publish Report'}
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

export default ReportForm;