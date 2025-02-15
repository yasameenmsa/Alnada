import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Plus, Minus } from 'lucide-react';

interface ProjectObjectivesProps {
  objectives_ar: string[];
  objectives_en: string[];
  onAddObjective: (language: 'ar' | 'en') => void;
  onUpdateObjective: (language: 'ar' | 'en', index: number, value: string) => void;
  onRemoveObjective: (language: 'ar' | 'en', index: number) => void;
}

const ProjectObjectives: React.FC<ProjectObjectivesProps> = ({
  objectives_ar,
  objectives_en,
  onAddObjective,
  onUpdateObjective,
  onRemoveObjective,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'الأهداف' : 'Objectives'}
      </h2>

      <div className="space-y-6">
        {/* Arabic Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الأهداف (عربي)' : 'Objectives (Arabic)'}*
          </label>
          {objectives_ar.map((objective, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => onUpdateObjective('ar', index, e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => onRemoveObjective('ar', index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddObjective('ar')}
            className="flex items-center text-primary hover:text-primary/80"
          >
            <Plus className="h-5 w-5 mr-1" />
            {language === 'ar' ? 'إضافة هدف' : 'Add Objective'}
          </button>
        </div>

        {/* English Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الأهداف (إنجليزي)' : 'Objectives (English)'}*
          </label>
          {objectives_en.map((objective, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => onUpdateObjective('en', index, e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => onRemoveObjective('en', index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddObjective('en')}
            className="flex items-center text-primary hover:text-primary/80"
          >
            <Plus className="h-5 w-5 mr-1" />
            {language === 'ar' ? 'إضافة هدف' : 'Add Objective'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectObjectives;