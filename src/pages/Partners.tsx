import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const Partners = () => {
  const { t, language } = useLanguage();

  const partners = [
    {
      id: 1,
      name: {
        ar: 'منظمة الأمم المتحدة للطفولة',
        en: 'UNICEF'
      },
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9',
      category: language === 'ar' ? 'شريك دولي' : 'International Partner',
      website: 'https://www.unicef.org',
    },
    {
      id: 2,
      name: {
        ar: 'برنامج الأمم المتحدة الإنمائي',
        en: 'UNDP'
      },
      logo: 'https://images.unsplash.com/photo-1598791318878-10e76d178023',
      category: language === 'ar' ? 'شريك دولي' : 'International Partner',
      website: 'https://www.undp.org',
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
          <h1 className="text-4xl font-bold mb-4">{t('partners.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <img
                src={partner.logo}
                alt={partner.name[language]}
                className="w-32 h-32 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-bold mb-2">{partner.name[language]}</h3>
              <p className="text-gray-600 mb-4">{partner.category}</p>
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium"
              >
                {t('partners.visit')}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;