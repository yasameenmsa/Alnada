import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Reports = () => {
  const { t, language } = useLanguage();

  const reports = [
    {
      id: 1,
      title: {
        ar: 'التقرير السنوي 2023',
        en: 'Annual Report 2023'
      },
      description: {
        ar: 'ملخص شامل لإنجازات وأنشطة المؤسسة خلال عام 2023',
        en: 'A comprehensive summary of the foundation\'s achievements and activities during 2023'
      },
      date: '2024-01-15',
      type: language === 'ar' ? 'تقرير سنوي' : 'Annual Report',
      fileSize: '2.5 MB',
      downloadUrl: '#',
    },
    {
      id: 2,
      title: {
        ar: 'تقرير المشاريع - الربع الأول 2024',
        en: 'Projects Report - Q1 2024'
      },
      description: {
        ar: 'تقرير تفصيلي عن سير المشاريع وتأثيرها على المجتمع',
        en: 'Detailed report on project progress and their impact on the community'
      },
      date: '2024-04-01',
      type: language === 'ar' ? 'تقرير ربع سنوي' : 'Quarterly Report',
      fileSize: '1.8 MB',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{t('reports.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('reports.subtitle')}
          </p>
        </motion.div>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-lg p-4 ml-6">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{report.title[language]}</h3>
                  <p className="text-gray-600 mb-4">{report.description[language]}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 ml-1" />
                      <span>{new Date(report.date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}</span>
                    </div>
                    <div>{t('reports.type')}: {report.type}</div>
                    <div>{t('reports.size')}: {report.fileSize}</div>
                  </div>
                </div>
                <a
                  href={report.downloadUrl}
                  className="flex items-center text-primary hover:text-primary/80 mr-4"
                >
                  <Download className="h-5 w-5 ml-1" />
                  {t('reports.download')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;