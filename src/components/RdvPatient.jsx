import React, { useEffect, useState, useContext } from "react";
import apiRequest from "../Api/apiRequest";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import NewRdvPatient from "./NewRdvPatient";

export default function RdvPatient() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [rendezVousList, setRendezVousList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRendezVous = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest.get(`/rendezvous/patient/${user.id}`);
      setRendezVousList(res.data);
    } catch (err) {
      console.error("Erreur récupération rendez-vous:", err);
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchRendezVous();
    }
  }, [user, t]);

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500 text-lg font-medium">
        {t("loading")}
      </p>
    );
  if (error)
    return (
      <p className="text-center py-8 text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{t("myAppointments")}</h2>
        {/* Exemple pour un bouton Ajouter si besoin */}
        {/* <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? t("cancel") : t("addAppointment")}
        </button> */}
      </div>

      {/* Formulaire d'ajout (optionnel) */}
      {/* {showForm && <NewRdvPatient onSubmit={fetchRendezVous} />} */}

      {rendezVousList.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">{t("noAppointments")}</p>
      ) : (
        <ul className="space-y-6">
          {rendezVousList.map((rdv) => (
            <li
              key={rdv.id}
              className="border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-semibold text-blue-700">
                  {new Date(rdv.dateHeure).toLocaleString()}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    rdv.statut === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : rdv.statut === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : rdv.statut === "COMPLETED"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {rdv.statut}
                </span>
              </div>

              <p className="mb-1">
                <strong>{t("typeOfVisit")} :</strong> {rdv.typeDeVisite}
              </p>
              <p className="mb-1">
                <strong>{t("remarks")} :</strong>{" "}
                {rdv.remarks || (
                  <span className="italic text-gray-500">{t("noRemarks")}</span>
                )}
              </p>
              {rdv.personnel && (
                <p className="text-sm text-gray-600">
                  <strong>{t("doctor")} :</strong> {rdv.personnel.prenom}{" "}
                  {rdv.personnel.nom} - {rdv.personnel.specialiteMedical}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
