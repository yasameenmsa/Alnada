import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://res.cloudinary.com/dh1lgpmm4/image/upload/v1737982974/NadaFoundation/LogoNada.jpg" alt="NFHD" className="h-12" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/" className="text-gray-700 hover:text-primary px-3">{t('nav.home')}</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary px-3">{t('nav.about')}</Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary px-3">{t('nav.projects')}</Link>
              <Link to="/partners" className="text-gray-700 hover:text-primary px-3">{t('nav.partners')}</Link>
              <Link to="/reports" className="text-gray-700 hover:text-primary px-3">{t('nav.reports')}</Link>
              <Link to="/news" className="text-gray-700 hover:text-primary px-3">{t('nav.news')}</Link>
              <Link to="/contact" className="btn-primary mx-3">{t('nav.contact')}</Link>
              <Link to="/admin" className="text-gray-700 hover:text-primary px-3">{t('nav.admin')}</Link>
              <div className="px-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary px-3">{t('nav.home')}</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary px-3">{t('nav.about')}</Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary px-3">{t('nav.projects')}</Link>
              <Link to="/partners" className="text-gray-700 hover:text-primary px-3">{t('nav.partners')}</Link>
              <Link to="/reports" className="text-gray-700 hover:text-primary px-3">{t('nav.reports')}</Link>
              <Link to="/news" className="text-gray-700 hover:text-primary px-3">{t('nav.news')}</Link>
              <Link to="/contact" className="btn-primary mx-3 text-center">{t('nav.contact')}</Link>
              <Link to="/admin" className="text-gray-700 hover:text-primary px-3">{t('nav.admin')}</Link>
              <div className="text-center px-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;