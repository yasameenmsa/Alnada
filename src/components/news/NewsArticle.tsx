import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Share2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Database } from '../../types/supabase';

type NewsArticle = Database['public']['Tables']['news']['Row'];

interface NewsArticleProps {
  article: NewsArticle;
  className?: string;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article, className = '' }) => {
  const { language } = useLanguage();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      language === 'ar' ? 'ar-YE' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  };

  const shareArticle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'ar' ? article.title_ar : article.title_en,
          text: language === 'ar' ? article.content_ar : article.content_en,
          url: window.location.href,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* Featured Image */}
      {article.image_url && (
        <div className="relative h-[400px]">
          <img
            src={article.image_url}
            alt={language === 'ar' ? article.title_ar : article.title_en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center text-sm mb-2">
              <Calendar className="h-4 w-4 ml-2" />
              <time>{formatDate(article.created_at)}</time>
              <span className="mx-2">•</span>
              <Tag className="h-4 w-4 ml-2" />
              <span>{article.category}</span>
            </div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? article.title_ar : article.title_en}
            </h1>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="p-6">
        {!article.image_url && (
          <>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Calendar className="h-4 w-4 ml-2" />
              <time>{formatDate(article.created_at)}</time>
              <span className="mx-2">•</span>
              <Tag className="h-4 w-4 ml-2" />
              <span>{article.category}</span>
            </div>
            <h1 className="text-3xl font-bold mb-6">
              {language === 'ar' ? article.title_ar : article.title_en}
            </h1>
          </>
        )}

        {/* Article Body */}
        <div className="prose max-w-none">
          {(language === 'ar' ? article.content_ar : article.content_en)
            .split('\n')
            .map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>

        {/* Share Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={shareArticle}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <Share2 className="h-5 w-5 ml-2" />
            <span>
              {language === 'ar' ? 'مشاركة المقال' : 'Share Article'}
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsArticle;