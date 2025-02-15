import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useEvents } from '../../../hooks/useEvents';
import EventForm from '../forms/EventForm';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../../ui/Modal';
import LoadingSpinner from '../../LoadingSpinner';
import DataTable from '../DataTable';

const AdminEvents = () => {
  const { language } = useLanguage();
  const { events, loading, error, deleteEvent, refreshEvents } = useEvents();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSuccess = async () => {
    await refreshEvents(); // Refresh data after successful operation
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
      key: 'event_date',
      label: language === 'ar' ? 'التاريخ' : 'Date',
      render: (date) => new Date(date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')
    },
    {
      key: 'location',
      label: language === 'ar' ? 'الموقع' : 'Location',
      render: (_, item) => language === 'ar' ? item.location_ar : item.location_en
    },
    {
      key: 'published',
      label: language === 'ar' ? 'الحالة' : 'Status',

      render: (published: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {published ? 
            (language === 'ar' ? 'منشور' : 'Published') : 
            (language === 'ar' ? 'مسودة' : 'Draft')}
        </span>
      )    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'إدارة الفعاليات' : 'Events Management'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-5 w-5 ml-2" />
          {language === 'ar' ? 'إضافة فعالية جديدة' : 'Add New Event'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        onEdit={setEditingItem}
        onDelete={deleteEvent}
      />

      <Modal
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
        title={language === 'ar' 
          ? (editingItem ? 'تعديل الفعالية' : 'إضافة فعالية جديدة')
          : (editingItem ? 'Edit Event' : 'Add New Event')
        }
      >
        <EventForm 
          initialData={editingItem}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default AdminEvents;