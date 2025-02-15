import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

interface Phase {
  name_ar: string;
  name_en: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface ProjectPhasesProps {
  phases: Phase[];
  onAddPhase: () => void;
  onUpdatePhase: (index: number, field: string, value: string) => void;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({
  phases,
  onAddPhase,
  onUpdatePhase,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {language === 'ar' ? 'مراحل المشروع' : 'Project Phases'}
        </h2>
        <button
          type="button"
          onClick={onAddPhase}
          className="flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-5 w- Continuing with the ProjectPhases.tsx file content:

5 w-5 mr-1" />
          {language === 'ar' ? 'إضافة مرحلة' : 'Add Phase'}
        </button>
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={language === 'ar' ? 'اسم المرحلة (عربي)' : 'Phase Name (Arabic)'}
                value={phase.name_ar}
                onChange={(e) => onUpdatePhase(index, 'name_ar', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="text"
                placeholder={language === 'ar' ? 'اسم المرحلة (إنجليزي)' : 'Phase Name (English)'}
                value={phase.name_en}
                onChange={(e) => onUpdatePhase(index, 'name_en', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="date"
                value={phase.start_date}
                onChange={(e) => onUpdatePhase(index, 'start_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="date"
                value={phase.end_date}
                onChange={(e) => onUpdatePhase(index, 'end_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                value={phase.status}
                onChange={(e) => onUpdatePhase(index, 'status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Planned">{language === 'ar' ? 'مخطط' : 'Planned'}</option>
                <option value="In Progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="Completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPhases;