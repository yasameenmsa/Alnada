import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { language } = useLanguage();

  return (
    <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg">
      <AlertTriangle className="h-5 w-5 ml-2" />
      <span>
        {language === 'ar' ? 'حدث خطأ: ' : 'Error: '}
        {message}
      </span>
    </div>
  );
};

export default ErrorMessage;