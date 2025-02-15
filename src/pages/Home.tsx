import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Target, Users, TrendingUp, Handshake } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
  const { t, language } = useLanguage();

  const goals = [
    {
      icon: Target,
      title: '1',
      text: t('home.goals.1'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-blue-500',
      delay: 0,
    },
    {
      icon: Users,
      title: '2',
      text: t('home.goals.2'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-green-500',
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      title: '3',
      text: t('home.goals.3'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-purple-500',
      delay: 0.2,
    },
    {
      icon: Handshake,
      title: '4',
      text: t('home.goals.4'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      textColor: 'text-orange-500',
      delay: 0.3,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              {language === 'ar' 
                ? 'مؤسسة الندى للتنمية الانسانية'
                : 'Nada Foundation for Human Development'}
            </h1>
            <p className="text-xl mb-8">{t('home.subtitle')}</p>
            <Link to="/about" className="btn-secondary">{t('home.about')}</Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('home.background.title')}</h2>
              <p className="text-gray-600 mb-6">{t('home.background.text')}</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t('home.vision')}</h3>
                  <p className="text-gray-600">{t('home.vision.text')}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t('home.mission')}</h3>
                  <p className="text-gray-600">{t('home.mission.text')}</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt={t('home.about')}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('home.goals.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: goal.delay }}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${goal.color} transform origin-left transition-all duration-300 group-hover:h-full group-hover:opacity-10`} />
                <div className="p-8 relative">
                  <div className={`w-12 h-12 rounded-lg ${goal.color} text-white flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <goal.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-4xl font-bold ${goal.textColor} mb-4 block`}>
                    {goal.title}
                  </span>
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {goal.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">{t('nav.projects')}</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {[1, 2, 3, 4, 5].map((index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={`https://images.unsplash.com/photo-${index + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                    alt={`Project ${index}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {language === 'ar' ? 'مشروع التمكين الاقتصادي' : 'Economic Empowerment Project'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'ar' 
                        ? 'برنامج يهدف إلى تمكين الشباب اقتصادياً من خلال التدريب وتوفير فرص العمل'
                        : 'A program aimed at economically empowering youth through training and job opportunities'}
                    </p>
                    <button className="text-primary hover:underline">
                      {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;