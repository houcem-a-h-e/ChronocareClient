import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import PatientSignUp from './components/PatientSignUp.jsx';
import ProfessionalSignUp from './components/ProfessionalSignUp.jsx';
import Login from './components/Login.jsx';
import Footer from './components/Footer.jsx';
import AdminUI from './components/AdminUI';
import PatientUI from './components/PatientUI.jsx';
import ProfessionalUI from './components/ProfessionalUI.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
function App() {
  return (
     <AuthProvider>
    <Router>
      {/* Navbar is included here to be present on all routes */}
      <Navbar />
      {/* Main content area with dark blue background */}
      <div className="bg-blue-900 min-h-screen flex flex-col w-screen"> {/* Changed to min-h-screen and flex column */}
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
