import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let user = await login(email, password);
      if(user.role === "ADMIN") navigate('/adminUI');
      else if(user.role === "PATIENT") navigate('/patientUI');
      else if(user.role === "HEALTH_PERSONNEL") navigate('/professionnelUI');
    } catch (error) {
      setErrorMessage(t('loginError'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
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
        
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {t('loginButton')}
        </button>
      </form>
    </div>
  );
}

export default Login;