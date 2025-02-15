import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useProjects } from '../../../hooks/useProjects';
import ProjectForm from '../forms/project/ProjectForm';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../../ui/Modal';
import LoadingSpinner from '../../LoadingSpinner';
import DataTable from '../DataTable';

const AdminProjects = () => {
  const { language } = useLanguage();
  const { projects, loading, error, deleteProject, refreshProjects } = useProjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSuccess = async () => {
    await refreshProjects(); // Refresh data after successful operation
    setShowAddForm(false);
    setEditingItem(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const columns = [
    {
      key: 'title',
      label: language === 'ar' ? 'العنوان' : 'Title',
      render: (_: any, item: any) => language === 'ar' ? item.title_ar : item.title_en
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status === 'ongoing' ? 
            (language === 'ar' ? 'جاري' : 'Ongoing') : 
            (language === 'ar' ? 'مكتمل' : 'Completed')}
        </span>
      )
    },
    {
      key: 'published',
      label: language === 'ar' ? 'النشر' : 'Published',
      render: (published: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {published ? 
            (language === 'ar' ? 'منشور' : 'Published') : 
            (language === 'ar' ? 'مسودة' : 'Draft')}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'إدارة المشاريع' : 'Projects Management'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-5 w-5 ml-2" />
          {language === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        onEdit={setEditingItem}
        onDelete={deleteProject}
      />

      <Modal
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
        title={language === 'ar' 
          ? (editingItem ? 'تعديل المشروع' : 'إضافة مشروع جديد')
          : (editingItem ? 'Edit Project' : 'Add New Project')
        }
      >
        <ProjectForm 
          initialData={editingItem}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default AdminProjects;