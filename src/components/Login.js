import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.js'; // Import AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let user = await login(email, password); // Call login function
      if(user.role === "ADMIN") navigate('/adminUI'); // Redirect based on role if needed
      else if(user.role === "PATIENT") navigate('/patientUI')
      else if(user.role === "HEALTH_PERSONNEL") navigate('/professionnelUI')
    } catch (error) {
      setErrorMessage('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
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
        
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Log In</button>
      </form>
    </div>
  );
}

export default Login;
