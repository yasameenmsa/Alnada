import React, { createContext, useContext, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.projects': 'المشاريع',
    'nav.partners': 'الشركاؤنا',
    'nav.reports': 'التقارير',
    'nav.news': 'الأخبار',
    'nav.contact': 'تواصل معنا',
    'nav.about': 'من نحن',
    'nav.admin': 'لوحة التحكم',
    
    'home.title': 'مؤسسة الندى للتنمية الانسانية',
    'home.subtitle': 'نعمل معاً من أجل مستقبل أفضل للجميع',
    'home.about': 'من نحن',
    'home.vision': 'رؤيتنا',
    'home.mission': 'رسالتنا',
    'home.vision.text': 'الريادة في العمل الإنساني والتنمية المستدامة',
    'home.mission.text': 'مكافحة الفقر وتخفيف المعاناة عن المجتمع وتحقيق التنمية المستدامة من خلال المساهمة في التنمية وتقديم الخدمات في مجالات الصحة والتعليم من خلال مشاريع شاملة وفقاً لأعلى معايير الأداء المؤسسي',
    'home.background.title': 'خلفية عن المؤسسة',
    'home.background.text': 'مؤسسة الندى للتنمية الانسانية هي منظمة مجتمعية مستقلة وغير حكومية وغير ربحية تأسست في 24/09/2014 ومسجلة لدى وزارة الشؤون الاجتماعية والعمل تحت رقم (7634-أ)',

    'search.placeholder': 'ابحث هنا...',
    'search.projects': 'بحث في المشاريع',
    'search.news': 'بحث في الأخبار',
    'search.no_results': 'لا توجد نتائج',
    'search.results': 'نتائج البحث',

    'home.goals.title': 'أهدافنا',
    'home.goals.1': 'المساهمة في تنمية المجتمع اليمني (اجتماعياً، صحياً، ثقافياً، مهنياً)',
    'home.goals.2': 'المشاركة في تعزيز الأمن الاجتماعي ومكافحة الفقر',
    'home.goals.3': 'تعزيز دور الشباب في صنع القرار',
    'home.goals.4': 'التعاون والتواصل مع الهيئات والمؤسسات والجمعيات والمنظمات المماثلة وفقاً للقانون',

    'projects.title': 'مشاريعنا',
    'projects.subtitle': 'نعمل على تنفيذ مشاريع تنموية تهدف إلى تحسين حياة المجتمعات المحلية وتمكين الأفراد',
    'projects.details': 'التفاصيل',
    'projects.status.ongoing': 'جاري',
    'projects.status.completed': 'مكتمل',
    'projects.beneficiaries': 'المستفيدون',
    'projects.duration': 'المدة',
    'projects.location': 'الموقع',

    'partners.title': 'شركاؤنا',
    'partners.subtitle': 'نفخر بشراكاتنا مع المنظمات المحلية والدولية التي تشاركنا رؤيتنا في التنمية المستدامة',
    'partners.visit': 'زيارة الموقع',

    'reports.title': 'التقارير والإصدارات',
    'reports.subtitle': 'نلتزم بالشفافية ونشر تقارير دورية عن أنشطتنا وإنجازاتنا',
    'reports.download': 'تحميل',
    'reports.type': 'نوع التقرير',
    'reports.size': 'حجم الملف',

    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نحن هنا للإجابة على استفساراتكم واستقبال مقترحاتكم',
    'contact.info': 'معلومات الاتصال',
    'contact.form.title': 'أرسل رسالة',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.address': 'العنوان',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',

    'about.title': 'من نحن',
    'about.subtitle': 'نبذة عن مؤسسة الندى للتنمية الانسانية',
    'about.history.title': 'تاريخنا',
    'about.history.text': 'تأسست مؤسسة الندى للتنمية الانسانية في عام 2014 كمنظمة غير حكومية وغير ربحية مكرسة لخدمة المجتمع اليمني. منذ تأسيسها، عملت المؤسسة على تنفيذ العديد من المشاريع التنموية في مجالات التعليم والصحة والتمكين الاقتصادي.',
    'about.values.title': 'قيمنا',
    'about.values.transparency': 'الشفافية',
    'about.values.transparency.text': 'نلتزم بالشفافية الكاملة في جميع عملياتنا وإدارة مواردنا',
    'about.values.excellence': 'التميز',
    'about.values.excellence.text': 'نسعى دائماً لتحقيق أعلى معايير الجودة في جميع مشاريعنا',
    'about.values.integrity': 'النزاهة',
    'about.values.integrity.text': 'نعمل بأمانة ومصداقية في جميع تعاملاتنا',
    'about.values.innovation': 'الابتكار',
    'about.values.innovation.text': 'نشجع الأفكار الجديدة والحلول المبتكرة لتحديات المجتمع',
    'about.team.title': 'فريق العمل',
    'about.team.subtitle': 'نفخر بفريقنا المتميز من الخبراء والمتخصصين',
    'about.impact.title': 'أثرنا',
    'about.impact.beneficiaries': 'مستفيد',
    'about.impact.projects': 'مشروع منجز',
    'about.impact.partners': 'شريك استراتيجي',
    'about.impact.cities': 'مدينة مستهدفة',

    'admin.title': 'لوحة التحكم',
    'admin.news': 'الأخبار',
    'admin.events': 'الفعاليات',
    'admin.reports': 'التقارير',
    'admin.add': 'إضافة',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.save': 'حفظ',
    'admin.cancel': 'إلغاء',
    'admin.title.field': 'العنوان',
    'admin.content': 'المحتوى',
    'admin.date': 'التاريخ',
    'admin.image': 'الصورة',
    'admin.category': 'التصنيف',
    'admin.status': 'الحالة',
    'admin.actions': 'الإجراءات',
    'admin.login': 'تسجيل الدخول',
    'admin.email': 'البريد الإلكتروني',
    'admin.password': 'كلمة المرور',
    'admin.logout': 'تسجيل الخروج'
  },
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.partners': 'Partners',
    'nav.reports': 'Reports',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.about': 'About Us',
    'nav.admin': 'Admin Panel',
    
    'home.title': 'Nada Foundation for Human Development',
    'home.subtitle': 'Working together for a better future for all',
    'home.about': 'About Us',
    'home.vision': 'Our Vision',
    'home.mission': 'Our Mission',
    'home.vision.text': 'Leadership in humanitarian work and sustainable development',
    'home.mission.text': 'Combat poverty, alleviate suffering from society, and achieve sustainable development by contributing to development and providing services in health and education fields through comprehensive projects according to the highest institutional standards of performance',
    'home.background.title': 'Background',
    'home.background.text': 'Nada Foundation for Human Development is an independent, non-governmental and non-profit community based organization established in 24/09/2014 and registered with the Ministry of Social Affairs and Labor under number (7634-A)',

    'search.placeholder': 'Search here...',
    'search.projects': 'Search Projects',
    'search.news': 'Search News',
    'search.no_results': 'No results found',
    'search.results': 'Search Results',

    'home.goals.title': 'Our Goals',
    'home.goals.1': 'Contribute to the development of Yemeni society (social, health, cultural, professional)',
    'home.goals.2': 'Participate in strengthening social security and fighting poverty',
    'home.goals.3': 'Strengthening the role of youth in decision-making',
    'home.goals.4': 'Cooperate and communicate with entities, institutions, associations, and similar organizations in accordance with law',

    'projects.title': 'Our Projects',
    'projects.subtitle': 'We implement development projects aimed at improving local communities and empowering individuals',
    'projects.details': 'Details',
    'projects.status.ongoing': 'Ongoing',
    'projects.status.completed': 'Completed',
    'projects.beneficiaries': 'Beneficiaries',
    'projects.duration': 'Duration',
    'projects.location': 'Location',

    'partners.title': 'Our Partners',
    'partners.subtitle': 'We are proud of our partnerships with local and international organizations that share our vision in sustainable development',
    'partners.visit': 'Visit Website',

    'reports.title': 'Reports & Publications',
    'reports.subtitle': 'We are committed to transparency and publishing periodic reports about our activities and achievements',
    'reports.download': 'Download',
    'reports.type': 'Report Type',
    'reports.size': 'File Size',

    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to answer your inquiries and receive your suggestions',
    'contact.info': 'Contact Information',
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',

    'about.title': 'About Us',
    'about.subtitle': 'About Nada Foundation for Human Development',
    'about.history.title': 'Our History',
    'about.history.text': 'Nada Foundation for Human Development was established in 2014 as a non-governmental, non-profit organization dedicated to serving Yemeni society. Since its establishment, the foundation has implemented numerous development projects in education, health, and economic empowerment.',
    'about.values.title': 'Our Values',
    'about.values.transparency': 'Transparency',
    'about.values.transparency.text': 'We are committed to complete transparency in all our operations and resource management',
    'about.values.excellence': 'Excellence',
    'about.values.excellence.text': 'We consistently strive to achieve the highest quality standards in all our projects',
    'about.values.integrity': 'Integrity',
    'about.values.integrity.text': 'We operate with honesty and credibility in all our dealings',
    'about.values.innovation': 'Innovation',
    'about.values.innovation.text': 'We encourage new ideas and innovative solutions to community challenges',
    'about.team.title': 'Our Team',
    'about.team.subtitle': 'We are proud of our distinguished team of experts and specialists',
    'about.impact.title': 'Our Impact',
    'about.impact.beneficiaries': 'Beneficiaries',
    'about.impact.projects': 'Completed Projects',
    'about.impact.partners': 'Strategic Partners',
    'about.impact.cities': 'Target Cities',

    'admin.title': 'Admin Panel',
    'admin.news': 'News',
    'admin.events': 'Events',
    'admin.reports': 'Reports',
    'admin.add': 'Add',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.title.field': 'Title',
    'admin.content': 'Content',
    'admin.date': 'Date',
    'admin.image': 'Image',
    'admin.category': 'Category',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.login': 'Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.logout': 'Logout'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};