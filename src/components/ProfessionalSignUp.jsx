import React, { useState } from 'react';
import apiRequest from '../Api/apiRequest';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

function ProfessionalSignUp() {
  let specId = '2'
  const [nom, setNom] = useState('');
  const [cin, setCin] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState(null);
  const [numeroIdentificationProfessionnelle, setNumeroIdentificationProfessionnelle] = useState(specId);
  const [specialiteMedical, setSpecialiteMedical] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [type, setType] = useState('Doctor');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { t } = useTranslation();
  
  function formatDateToDDMMYYYY(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post('/auth/registerPersonnnelDeSante', {
        nom,
        prenom,
        email,
        password,
        dateDeNaissance: formatDateToDDMMYYYY(dateDeNaissance), // <-- use this!
        numeroIdentificationProfessionnelle,
        specialiteMedical,
        numeroDeTelephone,
        cin,
        type,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setDateDeNaissance(null);
      setNumeroIdentificationProfessionnelle(specId);
      setSpecialiteMedical('');
      setNumeroDeTelephone('');
      setType('Doctor');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || t('registrationError'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 mt-8">{t('professionalSignUp')}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
          placeholder={t('lastName')}
          className="border p-2 mb-4 w-full"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t('firstName')}
          className="border p-2 mb-4 w-full"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t('email')}
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('password')}
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="mb-4">
          <DatePicker
            selected={dateDeNaissance}
            onChange={setDateDeNaissance}
            dateFormat="dd-MM-yyyy"
            placeholderText={t('dateOfBirth')}
            className="border p-2 w-full"
            required
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
          />
        </div>
        <input
          type="hidden"
          value={numeroIdentificationProfessionnelle}
          onChange={(e) => setNumeroIdentificationProfessionnelle(e.target.value)}
        />
        <input
          type="text"
          placeholder={t('medicalSpecialty')}
          className="border p-2 mb-4 w-full"
          value={specialiteMedical}
          onChange={(e) => setSpecialiteMedical(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder={t('phoneNumber')}
          className="border p-2 mb-4 w-full"
          value={numeroDeTelephone}
          onChange={(e) => setNumeroDeTelephone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t('nationalCardID')}
          className="border p-2 mb-4 w-full"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          required
        />
        <select
          className="border p-2 mb-4 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Doctor">{t('doctor')}</option>
          <option value="Nurse">{t('nurse')}</option>
          <option value="Technician">{t('technician')}</option>
        </select>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {t('signUp')}
        </button>
      </form>
    </div>
  );
}

export default ProfessionalSignUp;