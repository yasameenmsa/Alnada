// Admin Component
import { useState } from 'react';
import AdminTabs from './AdminTabs';
import AdminNews from './sections/AdminNews';
import AdminEvents from './sections/AdminEvents';
import AdminReports from './sections/AdminReports';
import AdminProjects from './sections/AdminProjects';
import SuccessStoryAdmin from './sections/SuccessStoryAdmin';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'reports' | 'projects' | 'success_stories'>('news');

  const handleTabChange = (tab: 'news' | 'events' | 'reports' | 'projects' | 'success_stories') => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'news' && (
        <>
          <AdminNews />
          <p>AdminNews rendered</p>
        </>
      )}
      {activeTab === 'events' && (
        <>
          <AdminEvents />
          <p>AdminEvents rendered</p>
        </>
      )}
      {activeTab === 'reports' && (
        <>
          <AdminReports />
          <p>AdminReports rendered</p>
        </>
      )}
      {activeTab === 'projects' && (
        <>
          <AdminProjects />
          <p>AdminProjects rendered</p>
        </>
      )}
      {activeTab === 'success_stories' && (
        <>
          <SuccessStoryAdmin />
          <p>SuccessStoryAdmin rendered</p>
        </>
      )}
    </div>
  );
};

export default Admin;