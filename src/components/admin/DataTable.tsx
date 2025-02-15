import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  actions?: (item: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  actions
}) => {
  const { language } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-2 text-right">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete || actions) && (
              <th className="px-4 py-2 text-right">
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-2">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete || actions) && (
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {onEdit && (
                      <Button variant="secondary" className="p-1" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="secondary" className="p-1" onClick={() => onDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {actions && actions(item)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;