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
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <header className="sticky top-0 z-10">
                        <Navbar />
                    </header>

                    <main className="flex-1 overflow-auto bg-blue-900 w-screen">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup/patient" element={<PatientSignUp />} />
                            <Route path="/signup/professionnel" element={<ProfessionalSignUp />} />

                            {/* Protected Routes */}
                            <Route
                                path="/adminUI"
                                element={
                                    <ProtectedRoute>
                                        <AdminUI />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/patientUI"
                                element={
                                    <ProtectedRoute>
                                        <PatientUI />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/professionnelUI"
                                element={
                                    <ProtectedRoute>
                                        <ProfessionalUI />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>

                    <footer className="sticky bottom-0 z-10">
                        <Footer />
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
