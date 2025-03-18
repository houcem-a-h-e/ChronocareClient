import React, { useState } from 'react';
import apiRequest from '../Api/apiRequest'; // Adjust the import path as necessary

function PatientSignUp() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [civilite, setCivilite] = useState('Monsieur'); // Default value
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await apiRequest.post('/auth/registerPatient', {
        nom,
        prenom,
        email,
        password,
        civilite,
        numeroDeTelephone,
      });

      // Handle successful registration
      setSuccessMessage(response.data.message);
      setErrorMessage(''); // Clear any previous error messages

      // Optionally reset the form fields
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setCivilite('Monsieur'); // Reset to default value
      setNumeroDeTelephone('');

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
      <h1 className="text-2xl font-bold mb-4 mt-8">Patient Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
          placeholder="Nom"
          className="border p-2 mb-4 w-full"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prenom"
          className="border p-2 mb-4 w-full"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Dropdown for Civilite */}
        <select
          className="border p-2 mb-4 w-full"
          value={civilite}
          onChange={(e) => setCivilite(e.target.value)}
        >
          <option value="Monsieur">Monsieur</option>
          <option value="Madame">Madame</option>
        </select>

        <input
          type="text"
          placeholder="Numero de Telephone"
          className="border p-2 mb-4 w-full"
          value={numeroDeTelephone}
          onChange={(e) => setNumeroDeTelephone(e.target.value)}
          required
        />

        {/* Display success or error message if any */}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}

export default PatientSignUp;
