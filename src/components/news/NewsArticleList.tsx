import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Database } from '../../types/supabase';
import NewsArticle from './NewsArticle';
import LoadingSpinner from '../LoadingSpinner';

type NewsArticle = Database['public']['Tables']['news']['Row'];

interface NewsArticleListProps {
  articles: NewsArticle[];
  loading?: boolean;
  error?: string | null;
}

const NewsArticleList: React.FC<NewsArticleListProps> = ({
  articles,
  loading = false,
  error = null,
}) => {
  const { language } = useLanguage();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {language === 'ar' ? 'حدث خطأ أثناء تحميل الأخبار' : 'Error loading news'}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        {language === 'ar' ? 'لا توجد أخبار' : 'No news available'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <NewsArticle article={article} />
        </motion.div>
      ))}
    </div>
  );
};

export default NewsArticleList;