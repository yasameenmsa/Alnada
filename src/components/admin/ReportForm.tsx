import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useReports } from '../../hooks/useReports';
import { Database } from '../../types/supabase';
import { supabase } from '../../services/supabase';
import { FileText, Loader } from 'lucide-react';

type ReportInsert = Database['public']['Tables']['reports']['Insert'];

const ReportForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { createReport } = useReports();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ReportInsert>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    file_url: '',
    file_size: '',
    report_type: '',
    published: false,
    user_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await createReport({
        ...formData,
        user_id: user.id,
      });
      onSuccess();
      setFormData({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        file_url: '',
        file_size: '',
        report_type: '',
        published: false,
        user_id: '',
      });
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        file_url: publicUrl,
        file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
          </label>
          <textarea
            required
            rows={4}
            value={formData.description_ar}
            onChange={e => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
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
            onChange={e => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'نوع التقرير' : 'Report Type'}
        </label>
        <input
          type="text"
          required
          value={formData.report_type}
          onChange={e => setFormData(prev => ({ ...prev, report_type: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ar' ? 'الملف' : 'File'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <FileText className="h-5 w-5 ml-2" />
            <span>{language === 'ar' ? 'اختر ملف' : 'Choose File'}</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {formData.file_url && (
            <span className="text-sm text-gray-600">
              {formData.file_size}
            </span>
          )}
        </div>
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
          {language === 'ar' ? 'نشر التقرير' : 'Publish Report'}
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
          language === 'ar' ? 'إضافة التقرير' : 'Add Report'
        )}
      </button>
    </form>
  );
};

export default ReportForm;