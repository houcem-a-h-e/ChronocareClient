import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-blue-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-grow flex justify-center">
          <p className='text-white'>{t('copyright')} © {new Date().getFullYear()}</p>
        </div>
      </div>
    </nav>
  );
};

export default Footer;