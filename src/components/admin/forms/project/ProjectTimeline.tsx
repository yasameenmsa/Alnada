import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface ProjectTimelineProps {
  start_date: string;
  end_date: string;
  status: string;
  onChange: (field: string, value: string) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  start_date,
  end_date,
  status,
  onChange,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'الجدول الزمني' : 'Timeline'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}*
          </label>
          <input
            type="date"
            required
            value={start_date}
            onChange={(e) => onChange('start_date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'تاريخ النهاية' : 'End Date'}*
          </label>
          <input
            type="date"
            required
            value={end_date}
            onChange={(e) => onChange('end_date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'حالة المشروع' : 'Project Status'}*
          </label>
          <select
            value={status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Planned">{language === 'ar' ? 'مخطط' : 'Planned'}</option>
            <option value="Ongoing">{language === 'ar' ? 'جاري' : 'Ongoing'}</option>
            <option value="Completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;