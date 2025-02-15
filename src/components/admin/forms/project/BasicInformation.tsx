import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface BasicInformationProps {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  onChange: (field: string, value: string) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  title_ar,
  title_en,
  description_ar,
  description_en,
  onChange,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}*
          </label>
          <input
            type="text"
            required
            value={title_ar}
            onChange={(e) => onChange('title_ar', e.target.value)}
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
            value={title_en}
            onChange={(e) => onChange('title_en', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}*
          </label>
          <textarea
            required
            rows={4}
            value={description_ar}
            onChange={(e) => onChange('description_ar', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}*
          </label>
          <textarea
            required
            rows={4}
            value={description_en}
            onChange={(e) => onChange('description_en', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;