import React, { useEffect, useState, useContext } from "react";
import apiRequest from "../Api/apiRequest";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";

export default function ConsultPatientFolder() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      setError(t("userNotAuthenticated"));
      setLoading(false);
      return;
    }

    const fetchDossiers = async () => {
      setLoading(true);
      setError(null);
      try {
        const patientRes = await apiRequest.get(`/patients/${user.id}`);
        const patientEmail = patientRes.data.email;
        const dossiersRes = await apiRequest.get(`/dossiers/patient/${patientEmail}`);
        setDossiers(dossiersRes.data);
      } catch (err) {
        console.error("Erreur récupération dossiers:", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, [user, t]);

  if (loading) return <p className="text-center py-8 text-gray-500">{t("loading")}</p>;
  if (error) return <p className="text-center py-8 text-red-600 font-semibold">{error}</p>;
  if (dossiers.length === 0) return <p className="text-center py-8 text-gray-600">{t("noMedicalDossiers")}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-3xl font-bold mb-8 text-center">{t("patientMedicalDossiers")}</h2>

      {dossiers.map((dossier) => (
        <div
          key={dossier.id}
          className="mb-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
            {dossier.fullName || t("untitledDossier")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base">
            <div>
              <p>
                <span className="font-semibold">{t("dossierNumber")}: </span>
                {dossier.dossierNumber}
              </p>
              <p>
                <span className="font-semibold">{t("gender")}: </span>
                {dossier.gender}
              </p>
              <p>
                <span className="font-semibold">{t("birthDate")}: </span>
                {new Date(dossier.birthDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">{t("phone")}: </span>
                {dossier.phone}
              </p>
              <p>
                <span className="font-semibold">{t("email")}: </span>
                {dossier.email}
              </p>
              {dossier.address && (
                <p>
                  <span className="font-semibold">{t("address")}: </span>
                  {dossier.address}
                </p>
              )}
            </div>

            <div>
              {dossier.bloodGroup && (
                <p>
                  <span className="font-semibold">{t("bloodGroup")}: </span>
                  <span className="inline-block bg-red-200 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {dossier.bloodGroup}
                  </span>
                </p>
              )}
              <p>
                <span className="font-semibold">{t("chronicDisease")}: </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    dossier.chronicDisease ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {dossier.chronicDisease ? t("yes") : t("no")}
                </span>
              </p>
              {dossier.diseaseDetails && (
                <p>
                  <span className="font-semibold">{t("diseaseDetails")}: </span>
                  {dossier.diseaseDetails}
                </p>
              )}
              {dossier.weight && (
                <p>
                  <span className="font-semibold">{t("weight")}: </span>
                  {dossier.weight} kg
                </p>
              )}
              {dossier.height && (
                <p>
                  <span className="font-semibold">{t("height")}: </span>
                  {dossier.height} cm
                </p>
              )}
              {dossier.medicalDocument && (
                <p>
                  <span className="font-semibold">{t("medicalDocument")}: </span>
                  <a
                    href={dossier.medicalDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {t("viewDocument")}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-3">{t("consultations")}</h4>
            {dossier.consultations.length === 0 ? (
              <p className="text-gray-600">{t("noConsultations")}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                {dossier.consultations.map((consult) => (
                  <li key={consult.id}>
                    <span className="font-medium">{new Date(consult.date).toLocaleDateString()}</span> -{" "}
                    {consult.motifConsultation || t("noDescription")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
