import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import AdminTabs from '../components/admin/AdminTabs';
import AdminNews from '../components/admin/sections/AdminNews';
import AdminEvents from '../components/admin/sections/AdminEvents';
import AdminReports from '../components/admin/sections/AdminReports';
import AdminProjects from '../components/admin/sections/AdminProjects';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { LogOut } from 'lucide-react';
import Button from '../components/ui/Button';

type AdminTab = 'news' | 'events' | 'reports' | 'projects';

const Admin = () => {
  const { isAuthenticated, loading, logout } = useAuthContext();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('news');

  // Set active tab based on URL path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin') {
      setActiveTab('news');
    } else if (path === 'events' || path === 'reports' || path === 'projects') {
      setActiveTab(path as AdminTab);
    }
  }, [location]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Save the intended destination
    const returnTo = location.pathname.split('/').pop() || 'news';
    return <Navigate to={`/login?returnTo=${returnTo}`} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
            <Button 
              variant="secondary"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              {t('admin.logout')}
            </Button>
          </div>
          
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'news' && <AdminNews />}
          {activeTab === 'events' && <AdminEvents />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'projects' && <AdminProjects />}
        </div>
      </div>
    </div>
  );
};

export default Admin;