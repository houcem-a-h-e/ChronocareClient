import React from 'react';
import { CiClock2 } from 'react-icons/ci';
import { FaHandHoldingMedical, FaHeartPulse } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-900 h-[32rem] flex flex-col items-center justify-start">
      <p className="text-green-400 text-3xl mt-10 mb-4">
        {t('welcomeHeader')}
      </p>
      <br />
      <p className="text-white text-lg mb-4">
        {t('homeSubtitle')}
      </p>
      <p className="text-white text-xl mb-4 text-center px-4">
        {t('homeDescription')}
      </p>
      <br />
      <Link 
        to="/signup/patient" 
        className="bg-green-500 text-white p-2 rounded mr-2"
      >
        {t('patientAccess')}
      </Link>
      <br />
      <Link 
        to="/signup/professionnel" 
        className="bg-blue-500 text-white p-2 rounded"
      >
        {t('professionalAccess')}
      </Link>
      <div className="flex items-center justify-between mt-4 space-x-10">
        <FaHeartPulse className="h-8 w-8"/>
        <CiClock2 className="h-8 w-8"/>
        <FaHandHoldingMedical className="h-8 w-8"/>
      </div>
    </div>
  );
}

export default Home;