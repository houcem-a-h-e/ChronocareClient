import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <nav className="bg-blue-800 p-4 mt-36">
      <div className="flex justify-between items-center">
        <div className="flex-grow flex justify-center">
          <p className='text-white'>Chronocare tous les droits réservés</p>
        </div>
      </div>
    </nav>
  );
};

export default Footer;