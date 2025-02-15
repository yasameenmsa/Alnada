import React from 'react';
import { Newspaper, Calendar, FileText, FolderOpen  } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminTabsProps {
  activeTab: 'news' | 'events' | 'reports' | 'projects' | 'success_stories';
  onTabChange: (tab: 'news' | 'events' | 'reports' | 'projects'| 'success_stories') => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();

  const tabs = [
    {
      id: 'news',
      label: language === 'ar' ? 'الأخبار' : 'News',
      icon: Newspaper
    },
    {
      id: 'events',
      label: language === 'ar' ? 'الفعاليات' : 'Events',
      icon: Calendar
    },
    {
      id: 'reports',
      label: language === 'ar' ? 'التقارير' : 'Reports',
      icon: FileText
    },
    {
      id: 'projects',
      label: language === 'ar' ? 'المشاريع' : 'Projects',
      icon: FolderOpen
    },
    {
      id: 'success_stories',
      label: language === 'ar' ? 'قصص نجاح' : 'Success Stories',
      icon: FileText
    }
  ];

  return (
    <nav className="flex space-x-8 rtl:space-x-reverse border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            console.log('Tab clicked:', tab.id);
            onTabChange(tab.id as 'news' | 'events' | 'reports' | 'projects' | 'success_stories');
          }}
          className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <tab.icon className="h-5 w-5 ml-2" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default AdminTabs;