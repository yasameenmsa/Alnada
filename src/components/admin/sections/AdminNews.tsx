import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useNews } from '../../../hooks/useNews';
import NewsForm from '../forms/NewsForm';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../../ui/Modal';
import LoadingSpinner from '../../LoadingSpinner';
import DataTable from '../DataTable';

const AdminNews = () => {
  const { language } = useLanguage();
  const { news, loading, error, deleteNews, refreshNews } = useNews();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSuccess = async () => {
    await refreshNews(); // Refresh data after successful operation
    setShowAddForm(false);
    setEditingItem(null);
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
      key: 'category',
      label: language === 'ar' ? 'التصنيف' : 'Category'
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'إدارة الأخبار' : 'News Management'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-5 w-5 ml-2" />
          {language === 'ar' ? 'إضافة خبر جديد' : 'Add New News'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        onEdit={setEditingItem}
        onDelete={deleteNews}
      />

      <Modal
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
        title={language === 'ar' 
          ? (editingItem ? 'تعديل الخبر' : 'إضافة خبر جديد')
          : (editingItem ? 'Edit News' : 'Add New News')
        }
      >
        <NewsForm 
          initialData={editingItem}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default AdminNews;