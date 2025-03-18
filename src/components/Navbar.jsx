import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext); // Get user info
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Function to determine the user's home route based on their role
  const getHomeRoute = () => {
    console.log("the user is ",user)
    if(user === null) return "/"
    if (user.role === "ADMIN") return "/adminUI";
    if (user.role === "PATIENT") return "/patientUI";
    if (user.role === "HEALTH_PERSONNEL") return "/professionnelUI";
    return "/"; // Default home for unauthenticated or unknown roles
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  useEffect(()=>{
    console.log("the user in navbar is ",user)
  },[user])
  
  return (
    <nav className="bg-blue-800 p-4 pr-16 pl-16">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          {/* Dynamic Home Link */}
          <Link to={getHomeRoute()}>{t("appName")}</Link>
        </div>
        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-8">
            <li>
              {/* Dynamic Home Link */}
              <Link to={getHomeRoute()} className="text-white hover:underline">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="text-white hover:underline"
                style={{ marginRight: "15px" }}
              >
                {t("help")}
              </Link>
            </li>

            {!isAuthenticated ? (
              <li>
                <Link to="/login" className="text-white hover:underline">
                  {t("login")}
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white hover:underline"
                >
                  {t("logout")}
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => i18n.changeLanguage("fr")}
            className={`px-2 py-1 rounded ${
              i18n.language === "fr" ? "bg-blue-600" : "bg-blue-400"
            }`}
          >
            Français
          </button>
          <button
            onClick={() => i18n.changeLanguage("ar")}
            className={`px-2 py-1 rounded ${
              i18n.language === "ar" ? "bg-blue-600" : "bg-blue-400"
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
