import React, { useState } from 'react';
import apiRequest from '../Api/apiRequest'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ProfessionalSignUp() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState(null); // Use null for DatePicker
  const [numeroIdentificationProfessionnelle, setNumeroIdentificationProfessionnelle] = useState('');
  const [specialiteMedical, setSpecialiteMedical] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [type, setType] = useState('Doctor'); // Default value
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await apiRequest.post('/auth/registerPersonnnelDeSante', {
        nom,
        prenom,
        email,
        password,
        dateDeNaissance: dateDeNaissance ? `${String(dateDeNaissance.getDate()).padStart(2, '0')}-${String(dateDeNaissance.getMonth() + 1).padStart(2, '0')}-${dateDeNaissance.getFullYear()}` : '',
        numeroIdentificationProfessionnelle,
        specialiteMedical,
        numeroDeTelephone,
        type,
      });

      // Handle successful registration
      setSuccessMessage(response.data.message);
      setErrorMessage(''); // Clear any previous error messages

      // Optionally reset the form fields
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setDateDeNaissance(null); // Reset to null
      setNumeroIdentificationProfessionnelle('');
      setSpecialiteMedical('');
      setNumeroDeTelephone('');
      setType('Doctor'); // Reset to default value

    } catch (error) {
      // Handle errors (e.g., display error message)
      if (error.response) {
        // The request was made and the server responded with a status code
        setErrorMessage(error.response.data.message || 'Registration failed!');
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 mt-8">Professional Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
          placeholder="Nom"
          className="border p-1 mb-3 w-full"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prénom"
          className="border p-1 mb-3 w-full"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="border p-1 mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-1 mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Date Picker for Date de Naissance */}
        <div className="mb-4">
          <DatePicker
            selected={dateDeNaissance}
            onChange={(date) => setDateDeNaissance(date)} // Update state with selected date
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            className="border p-2 w-full"
            required
            isClearable
            maxDate={new Date()} // Prevent future dates from being selected
            showYearDropdown
            scrollableMonthYearDropdown
            dropdownMode="select"
          />
        </div>

        <input
          type="text"
          placeholder="Numéro d'Identification Professionnelle"
          className="border p-1 mb-3 w-full"
          value={numeroIdentificationProfessionnelle}
          onChange={(e) => setNumeroIdentificationProfessionnelle(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Spécialité Médicale"
          className="border p-1 mb-3 w-full"
          value={specialiteMedical}
          onChange={(e) => setSpecialiteMedical(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Numéro de Téléphone"
          className="border p-1 mb-3 w-full"
          value={numeroDeTelephone}
          onChange={(e) => setNumeroDeTelephone(e.target.value)}
          required
        />

        {/* Dropdown for Type */}
        <select
            className="border p-1 mb-3 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
        >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Technician">Technician</option>
            {/* Add more options as needed */}
        </select>

        {/* Display success or error message if any */}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}

export default ProfessionalSignUp;
