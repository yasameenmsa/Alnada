import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="https://res.cloudinary.com/dh1lgpmm4/image/upload/v1737982974/NadaFoundation/LogoNada.jpg" alt="NFHD" className="h-12 mb-4" />
            <p className="text-gray-400">
              {language === 'ar' ? 'مستقبل أفضل للجميع' : 'A better future for all'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-white">{language === 'ar' ? 'المشاريع' : 'Projects'}</Link></li>
              <li><Link to="/partners" className="text-gray-400 hover:text-white">{language === 'ar' ? 'الشركاء' : 'Partners'}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">{language === 'ar' ? 'تواصل معنا' : 'Contact'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400" dir="ltr">+967 3 209964</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 break-all" dir="ltr">Hashem@nada-ye.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 break-all" dir="ltr">Nadafoundation2014@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-400">
                  {language === 'ar' 
                    ? 'شارع المينا، محافظة الحديدة، الجمهورية اليمنية'
                    : 'Almina Street, Hodeidah Gov., Republic of Yemen'}
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">{language === 'ar' ? 'النشرة البريدية' : 'Newsletter'}</h3>
            <p className="text-gray-400 mb-3 text-sm">
              {language === 'ar' 
                ? 'اشترك للحصول على آخر الأخبار'
                : 'Subscribe for latest updates'}
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                className="w-full max-w-[200px] px-3 py-2 rounded-r-lg focus:outline-none text-sm text-gray-900 bg-white"
              />
              <button className="btn-primary rounded-l-lg rounded-r-none px-3 py-2 text-sm whitespace-nowrap">
                {language === 'ar' ? 'اشتراك' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {language === 'ar' ? 'مؤسسة الندى للتنمية الانسانية' : 'Nada Foundation for Human Development'}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;