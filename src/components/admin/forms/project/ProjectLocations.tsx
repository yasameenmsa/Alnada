import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

interface Location {
  name_ar: string;
  name_en: string;

}

interface ProjectLocationsProps {
  locations: Location[];
  onAddLocation: () => void;
  onUpdateLocation: (index: number, field: string, value: string) => void;
}

const ProjectLocations: React.FC<ProjectLocationsProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {language === 'ar' ? 'المواقع' : 'Locations'}
        </h2>
        <button
          type="button"
          onClick={onAddLocation}
          className="flex items-center text-primary hover:text-primary/80"
        >
          <Plus className="h-5 w-5 mr-1" />
          {language === 'ar' ? 'إضافة موقع' : 'Add Location'}
        </button>
      </div>

      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={language === 'ar' ? 'اسم الموقع (عربي)' : 'Location Name (Arabic)'}
                value={location.name_ar}
                onChange={(e) => onUpdateLocation(index, 'name_ar', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="text"
                placeholder={language === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Location Name (English)'}
                value={location.name_en}
                onChange={(e) => onUpdateLocation(index, 'name_en', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectLocations;