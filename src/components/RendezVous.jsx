import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";

// Importe ici tes composants spécifiques aux rendez-vous
import NewRendezVousForm from "./NewRendezVousForm";
import ConfirmRendezVous from "./ConfirmRendezVous";

const RendezVous = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState("main"); // 'main', 'new', 'confirm'

  const renderView = () => {
    switch (currentView) {
      case "new":
        return (
          <>
            <button
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-blue-700 mb-6 hover:text-red-700 transition-colors"
            >
              <FaArrowLeft />
              <span>{t("backToMenu")}</span>
            </button>
            <NewRendezVousForm
              onSubmit={() => setCurrentView("main")}
            />
          </>
        );

      case "confirm":
        return (
          <>
            <button
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-blue-700 mb-6 hover:text-red-700 transition-colors"
            >
              <FaArrowLeft />
              <span>{t("backToMenu")}</span>
            </button>
            <ConfirmRendezVous
              onConfirm={() => setCurrentView("main")}
            />
          </>
        );

      default:
        return (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">
              {t("manageAppointments")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentView("new")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {t("newRendezVous")}
              </button>
              <button
                onClick={() => setCurrentView("confirm")}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                {t("confirmRendezVous")}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md min-h-24 bg-gray-800">
      {renderView()}
    </div>
  );
};

export default RendezVous;
