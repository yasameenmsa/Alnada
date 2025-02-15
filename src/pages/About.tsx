import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award, CheckCircle, Heart, Lightbulb, HandHeart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  const impactStats = [
    {
      icon: Users,
      value: '50,000+',
      label: t('about.impact.beneficiaries'),
    },
    {
      icon: Target,
      value: '100+',
      label: t('about.impact.projects'),
    },
    {
      icon: Shield,
      value: '25+',
      label: t('about.impact.partners'),
    },
    {
      icon: Award,
      value: '15+',
      label: t('about.impact.cities'),
    },
  ];

  const values = [
    {
      icon: CheckCircle,
      title: t('about.values.transparency'),
      description: t('about.values.transparency.text'),
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Heart,
      title: t('about.values.excellence'),
      description: t('about.values.excellence.text'),
      color: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      icon: HandHeart,
      title: t('about.values.integrity'),
      description: t('about.values.integrity.text'),
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation'),
      description: t('about.values.innovation.text'),
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  const visionPoints = [
    {
      ar: 'تقديم برامج تعليمية مبتكرة',
      en: 'Providing innovative educational programs',
    },
    {
      ar: 'تعزيز الأمن الغذائي',
      en: 'Enhancing food security',
    },
    {
      ar: 'تحسين الأمن المائي',
      en: 'Improving water security',
    },
    {
      ar: 'تنفيذ ودعم المبادرات المناخية',
      en: 'Implementing and supporting climate initiatives',
    },
    {
      ar: 'بناء القدرات وتمكين المجتمع',
      en: 'Building capacities and empowering the community',
    },
    {
      ar: 'الشراكة مع أصحاب المصلحة',
      en: 'Partnership with stakeholders',
    },
  ];

  const workAreas = [
    {
      title: language === 'ar' ? 'الإغاثة الطارئة' : 'Emergency Relief',
      description: language === 'ar' 
        ? 'تقديم المساعدات الإنسانية العاجلة للمتضررين من الأزمات والكوارث، مثل الغذاء والدواء والمأوى والرعاية الصحية'
        : 'Providing urgent humanitarian assistance to those affected by crises and disasters, such as food, medicine, shelter, and healthcare.',
      color: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      title: language === 'ar' ? 'التنمية المستدامة' : 'Sustainable Development',
      description: language === 'ar'
        ? 'تمكين المجتمعات المحلية من خلال مشاريع التنمية المستدامة في مختلف المجالات، مثل الزراعة والصحة والتعليم والبنية التحتية'
        : 'Empowering local communities through sustainable development projects in various fields, such as agriculture, health, education, and infrastructure.',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      title: language === 'ar' ? 'بناء القدرات' : 'Capacity Building',
      description: language === 'ar'
        ? 'بناء قدرات الكوادر اليمنية العاملة في المجال الإنساني والتنموي، وتوفير التدريب والتأهيل اللازمين'
        : 'Building the capacities of Yemeni cadres working in the humanitarian and development field, and providing the necessary training and qualification.',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: language === 'ar' ? 'دعم حقوق الإنسان' : 'Human Rights Support',
      description: language === 'ar'
        ? 'الدفاع عن وحماية حقوق الإنسان وتعزيز مبادئ الحوكمة الرشيدة والشفافية'
        : 'Defending and protecting human rights and promoting the principles of good governance and transparency.',
      color: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517048676732-d65bc937f952)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container relative h-full flex items-center"
        >
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              {language === 'ar' 
                ? 'مؤسسة الندى للتنمية الانسانية - اليمن'
                : 'Nada Foundation for Human Development - Yemen (NFHD)'}
            </h1>
            <p className="text-xl">
              {language === 'ar'
                ? 'منذ تأسيسها في عام 2014، برزت مؤسسة ندى للتنمية الانسانية كمنارة أمل في اليمن، ملتزمة بتحقيق التنمية المستدامة وبناء مجتمع أكثر عدلاً ومساواة'
                : 'Since its establishment in 2014, NFHD has emerged as a beacon of hope in Yemen, committed to achieving sustainable development and building a more just and equal society.'}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {language === 'ar'
                ? 'المساهمة في التنمية المستدامة لتحقيق تغيير إيجابي ودائم من خلال:'
                : 'Contributing to sustainable development to achieve positive and lasting change through:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-gray-800 font-medium">
                    {point[language]}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Areas Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'مجالات عملنا' : 'Our Work Areas'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'تعمل المؤسسة لتحقيق هذه الرؤية من خلال مجموعة من الأهداف النبيلة'
                : 'The foundation works to achieve this vision through a set of noble goals'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${area.color} rounded-lg p-6 hover:shadow-lg transition-shadow duration-300`}
              >
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className="text-gray-600">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('about.impact.title')}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;