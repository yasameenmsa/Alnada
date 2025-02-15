import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useReports } from '../../../hooks/useReports';
import ReportForm from '../forms/ReportForm';
import Button from '../../ui/Button';
import { Plus, Download } from 'lucide-react';
import Modal from '../../ui/Modal';
import LoadingSpinner from '../../LoadingSpinner';
import DataTable from '../DataTable';

const AdminReports = () => {
  const { language } = useLanguage();
  const { reports, loading, error, deleteReport, refreshReports } = useReports();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const handleSuccess = async () => {
    await refreshReports();
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (item: any) => {
    setDeletingItem(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingItem) {
      await deleteReport(deletingItem.id);
      setShowDeleteConfirm(false);
      setDeletingItem(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const columns = [
    {
      key: 'title',
      label: language === 'ar' ? 'العنوان' : 'Title',
      render: (_, item) => language === 'ar' ? item.title_ar : item.title_en
    },
    {
      key: 'report_type',
      label: language === 'ar' ? 'النوع' : 'Type'
    },
    {
      key: 'file_size',
      label: language === 'ar' ? 'الحجم' : 'Size'
    },
    {
      key: 'published',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (published) => (
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

  const renderActions = (item: any) => (
    <a 
      href={item.file_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
    >
      <Download className="h-4 w-4" />
    </a>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'إدارة التقارير' : 'Reports Management'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-5 w-5 ml-2" />
          {language === 'ar' ? 'إضافة تقرير جديد' : 'Add New Report'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        onEdit={setEditingItem}
        onDelete={handleDeleteClick}
        actions={renderActions}
      />

      <Modal
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
        title={language === 'ar' 
          ? (editingItem ? 'تعديل التقرير' : 'إضافة تقرير جديد')
          : (editingItem ? 'Edit Report' : 'Add New Report')
        }
      >
        <ReportForm 
          initialData={editingItem}
          onSuccess={handleSuccess}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingItem(null);
        }}
        title={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
      >
        <div className="p-6">
          <p className="mb-6">
            {language === 'ar'
              ? 'هل أنت متأكد من حذف هذا التقرير؟'
              : 'Are you sure you want to delete this report?'}
          </p>
          <div className="flex justify-end space-x-4 rtl:space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletingItem(null);
              }}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReports;