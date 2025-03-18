import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
const Navbar = () => {
    const location = useLocation(); // Get the current location
    const { isAuthenticated, logout } = useContext(AuthContext); // Get auth context values

    return (
        <nav className="bg-blue-800 p-4">
            <div className="flex justify-between items-center">
                <div className="text-white font-bold text-lg">
                    <Link to="/">Chronocare</Link>
                </div>
                <div className="flex-grow flex justify-center">
                    <ul className="flex space-x-8">
                        <li>
                            <Link to="/" className="text-white hover:underline">Accueil</Link>
                        </li>
                        <li>
                            <Link to="/help" className="text-white hover:underline">Besoin d'aide</Link>
                        </li>

                        {/* Show Connexion link if not authenticated */}
                        {!isAuthenticated ? (
                            <li>
                                <Link to="/login" className="text-white hover:underline">Connexion</Link>
                            </li>
                        ) : (
                            // Show Logout button if authenticated
                            <>
                                <li>
                                    <button 
                                        onClick={logout} 
                                        className="text-white hover:underline"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
