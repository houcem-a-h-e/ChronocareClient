import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon
import CreatePatientForm from "./CreatePatientForm";
import UpdatePatientForm from "./UpdatePatientFrom";
import UpdateMedicalFolderMenu from "./UpdateMedicalFolderMenu";

const MedicalFolderProfessional = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState("main"); // 'main', 'create', 'update', 'history'

  const renderView = () => {
    switch(currentView) {
      case "create":
        return (
          <>
            <button 
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-blue-700 mb-6 hover:text-red-700 transition-colors"
            >
              <FaArrowLeft />
              <span>{t("backToRecords")}</span>
            </button>
            <CreatePatientForm 
              onSubmit={() => setCurrentView("main")} // Goes back after submission
            />
          </>
        );
      // Add cases for 'update' and 'history' later
      case "update":
        return (
          <>
            <button 
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-blue-700 mb-6 hover:text-red-700 transition-colors"
            >
              <FaArrowLeft />
              <span>{t("backToRecords")}</span>
            </button>
            <UpdateMedicalFolderMenu
              onSubmit={() => setCurrentView("main")} // Goes back after submission
            />
          </>
        )
      default:
        return (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">
              {t("manageMedicalRecords")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setCurrentView("create")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {t("createRecord")}
              </button>
              <button 
                onClick={() => setCurrentView("update")} 
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {t("updateRecord")}
              </button>
              
            </div>
          </>
        );
    }
    
  };

  return (
    <div className="p-6 rounded-lg shadow-md min-h-24">
      {renderView()}
    </div>
  );
};

export default MedicalFolderProfessional;