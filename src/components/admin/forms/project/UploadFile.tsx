import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { FileText, X } from 'lucide-react';
import Button from '../../../ui/Button';

interface MediaFile {
  url: string;
  uploaded_at: string;
  description_ar?: string;
  description_en?: string;
}

interface UploadFileProps {
  mainFile: MediaFile;
  files: MediaFile[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onRemoveFile: (index: number, isMain?: boolean) => void;
  onUpdateDescription?: (index: number, lang: 'ar' | 'en', value: string) => void;
  loading: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({
  mainFile,
  files,
  onFileUpload,
  onRemoveFile,
  onUpdateDescription,
  loading,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'ar' ? 'الملفات' : 'Files'}
      </h3>

      {/* Main File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الملف الرئيسي' : 'Main File'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('mainFile')?.click()}
            disabled={loading}
          >
            <FileText className="h-5 w-5 ml-2" />
            {language === 'ar' ? 'اختر ملف' : 'Choose File'}
          </Button>
          <input
            id="mainFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => onFileUpload(e, true)}
            className="hidden"
          />
          {mainFile.url && (
            <div className="relative flex items-center">
              <FileText className="h-8 w-8 text-gray-500" />
              <a
                href={mainFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline"
              >
                {language === 'ar' ? 'عرض الملف' : 'View File'}
              </a>
              <button
                type="button"
                onClick={() => onRemoveFile(0, true)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Files */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'ملفات إضافية' : 'Additional Files'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('additionalFiles')?.click()}
            disabled={loading}
          >
            <FileText className="h-5 w-5 ml-2" />
            {language === 'ar' ? 'اختر ملفات' : 'Choose Files'}
          </Button>
          <input
            id="additionalFiles"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onFileUpload}
            multiple
            className="hidden"
          />
        </div>
        <div className="space-y-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500" />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:underline"
                >
                  {language === 'ar' ? 'عرض الملف' : 'View File'}
                </a>
              </div>
              {onUpdateDescription && (
                <div className="flex-grow mx-4 space-y-2">
                  <input
                    type="text"
                    value={file.description_ar || ''}
                    onChange={(e) => onUpdateDescription(index, 'ar', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (عربي)' : 'Description (Arabic)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    value={file.description_en || ''}
                    onChange={(e) => onUpdateDescription(index, 'en', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (إنجليزي)' : 'Description (English)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;