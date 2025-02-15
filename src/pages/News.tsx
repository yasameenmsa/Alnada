import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SearchBar from '../components/SearchBar';

const news = [
  {
    id: 1,
    title: {
      ar: 'إطلاق مشروع التمكين الاقتصادي في صنعاء',
      en: 'Launch of Economic Empowerment Project in Sana\'a'
    },
    excerpt: {
      ar: 'أطلقت مؤسسة ندى للتنمية الإنسانية مشروعاً جديداً يهدف إلى تمكين الشباب اقتصادياً',
      en: 'NFHD launched a new project aimed at economically empowering youth'
    },
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    category: {
      ar: 'مشاريع',
      en: 'Projects'
    },
  },
  {
    id: 2,
    title: {
      ar: 'توقيع اتفاقية شراكة مع منظمة دولية',
      en: 'Partnership Agreement Signed with International Organization'
    },
    excerpt: {
      ar: 'وقعت المؤسسة اتفاقية شراكة استراتيجية لتنفيذ مشاريع تنموية في المناطق الريفية',
      en: 'The foundation signed a strategic partnership agreement to implement development projects in rural areas'
    },
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf',
    category: {
      ar: 'شراكات',
      en: 'Partnerships'
    },
  },
];

const News = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    if (!searchQuery) return news;
    const query = searchQuery.toLowerCase();
    return news.filter(item => 
      item.title[language].toLowerCase().includes(query) ||
      item.excerpt[language].toLowerCase().includes(query) ||
      item.category[language].toLowerCase().includes(query)
    );
  }, [news, searchQuery, language]);

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'آخر الأخبار' : 'Latest News'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {language === 'ar' 
              ? 'تابع آخر أخبار وأنشطة المؤسسة والمشاريع التي نعمل عليها'
              : 'Follow our latest news, activities, and projects we are working on'}
          </p>
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder={language === 'ar' ? 'بحث في الأخبار' : 'Search News'}
          />
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title[language]}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>{new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}</span>
                    <span className="mx-2">•</span>
                    <span className="text-primary">{item.category[language]}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title[language]}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt[language]}</p>
                  <button className="text-primary hover:text-primary/80 font-medium flex items-center">
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    {language === 'ar' ? <ArrowLeft className="h-4 w-4 mr-1" /> : <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />}
                  </button>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;