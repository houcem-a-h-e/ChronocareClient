import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiRequest from '../Api/apiRequest';// adapte le chemin vers ton apiRequest

const ConfirmRendezVous = () => {
  const { t } = useTranslation();
  const [rendezVousList, setRendezVousList] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRendezVous = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest.get("/getRendezVousByPersonnelEmail");
        setRendezVousList(response.data);
      } catch (err) {
        setError(t("fetchError"));
        console.error("Erreur récupération rendez-vous :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRendezVous();
  }, [t]);

  const handleAction = async (id, action) => {
    let newStatut;
    switch (action) {
      case "Confirmer":
        newStatut = "CONFIRMED";
        break;
      case "Annuler":
        newStatut = "CANCELED";
        break;
      case "Compléter":
        newStatut = "COMPLETED";
        break;
      default:
        return;
    }
  
    try {
      await apiRequest.patch(`/rendezvous/${id}/statut`, { statut: newStatut });
      alert(t("statusUpdatedSuccess"));
      // Rafraîchir la liste après mise à jour
      const response = await apiRequest.get("/getRendezVousByPersonnelEmail");
      setRendezVousList(response.data);
    } catch (error) {
      console.error("Erreur mise à jour statut :", error);
      alert(t("statusUpdateError"));
    }
  }

  const handleRowClick = (patientPhone) => {
    setSelectedPhone(patientPhone);
  };

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto text-black">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left bg-blue-500">Email patient</th>
            <th className="py-3 px-4 text-left bg-blue-500">Date et heure</th>
            <th className="py-3 px-4 text-left bg-blue-500">{t('Type')}</th>
            <th className="py-3 px-4 text-left bg-blue-500">Statut</th>
            <th className="py-3 px-4 text-left bg-blue-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rendezVousList.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                {t("noAppointments")}
              </td>
            </tr>
          ) : (
            rendezVousList.map((rdv) => (
              <tr
                key={rdv.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(rdv.patientPhone || "")}
              >
                <td className="border-t border-gray-300 py-2 px-4">{rdv.patientEmail}</td>
                <td className="border-t border-gray-300 py-2 px-4">
                  {new Date(rdv.dateHeure).toLocaleString()}
                </td>
                <td className="border-t border-gray-300 py-2 px-4 capitalize">{rdv.typeDeVisite}</td>
                <td className="border-t border-gray-300 py-2 px-4 uppercase">
                  {rdv.statut==='PLANNED'? 'planifié':rdv.statut==='CONFIRMED'?'confirmé':
                  rdv.statut==='CANCELLED'?'annulé':'achevé'}</td>
                <td className="border-t border-gray-300 py-2 px-4 space-x-2">
  {rdv.statut !== "COMPLETED" ? (
    <>
      {rdv.statut === "PLANNED" && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(rdv.id, "Confirmer");
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
          >
            {t("confirm")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(rdv.id, "Annuler");
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            {t("cancel")}
          </button>
        </>
      )}
      {(rdv.statut === "CONFIRMED" || rdv.statut === "PLANNED") && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction(rdv.id, "Compléter");
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          {t("complete")}
        </button>
      )}
    </>
  ) : (
    <span className="italic text-gray-500">{t("completed")}</span>
  )}
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedPhone && (
        <div className="mt-4 p-4  rounded shadow bg-blue-400 text-black">
          <strong>{t("patientPhone")}:</strong> {selectedPhone}
        </div>
      )}
    </div>
  );
};

export default ConfirmRendezVous;
