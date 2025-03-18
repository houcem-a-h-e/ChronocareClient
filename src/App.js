import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PatientSignUp from './components/PatientSignUp';
import ProfessionalSignUp from './components/ProfessionalSignUp';
import Login from './components/Login';
import Footer from './components/Footer';
import AdminUI from './components/AdminUI';
import PatientUI from './components/PatientUI';
import ProfessionalUI from './components/ProfessionalUI';
import { AuthProvider } from './Context/AuthContext.js';
function App() {
  return (
     <AuthProvider>
    <Router>
      {/* Navbar is included here to be present on all routes */}
      <Navbar />
      {/* Main content area with dark blue background */}
      <div className="bg-blue-900 min-h-screen flex flex-col"> {/* Changed to min-h-screen and flex column */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminUI" element={<AdminUI />} />
          <Route path="/patientUI" element={<PatientUI />} />
          <Route path="/professionnelUI" element={<ProfessionalUI />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/patient" element={<PatientSignUp />} />
          <Route path="/signup/professionnel" element={<ProfessionalSignUp />} />
        </Routes>
        <Footer /> {/* Moved Footer inside the flex container */}
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
