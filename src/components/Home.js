import React from 'react';
import { CiClock2 } from 'react-icons/ci';
import { FaHandHoldingMedical, FaHeartPulse } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-blue-900 h-96 flex flex-col items-center justify-start">
      <p className="text-green-400 text-3xl mt-10 mb-4">Bienvenue sur ChronoCare</p>
      <br />
      <p className="text-white text-lg mb-4">Un carnet de santé dans votre main</p>
      <p className="text-white text-xl mb-4">Transformez votre expérience médicale avec une plateforme visonnaire conçue pour gagner du temps et optimiser les soins</p>
      <br />
      <Link to="/signup/patient" className="bg-green-500 text-white p-2 rounded mr-2">
        Accéder à Chronocare en tant que patient
      </Link>
      <br />
      <Link to="/signup/professionnel" className="bg-blue-500 text-white p-2 rounded">
        Accéder à Chronocare en tant que professionnel de santé
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