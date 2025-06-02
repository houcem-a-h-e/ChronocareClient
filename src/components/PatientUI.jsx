import React, { useContext, useState, useEffect } from "react";
import { FaPhoneAlt, FaUserCircle, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import apiRequest from "../Api/apiRequest";
import MedicalFolderProfessional from "./MedicalFolderProfessional";
import ConsultPatientFolder from "./ConsultPatientFolder";
import RdvPatient from "./RdvPatient";

export default function PatientUI() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const [activeChoice, setActiveChoice] = useState("");
  const [formData, setFormData] = useState({
    civilite: "masculin",
    numeroDeTelephone: "",
    email: "",
    avatar: null,
  });
  const [kids, setKids] = useState([]);
  const [newKid, setNewKid] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  })
  useEffect(() => {
    if (user) {
      setFormData({
        civilite: user.civilite || "masculin",
        numeroDeTelephone: user.numeroDeTelephone || "",
        email: user.email || "",
        avatar: null,
      });
    }
  }, [user]);

  const handleChoiceClick = (choice) => setActiveChoice(choice);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      const response = await apiRequest.patch(`/patient/${user.id}/profile`, formDataToSend);

      if (response.status === 200) {
        alert(t("profileUpdatedSuccess"));
      } else {
        throw new Error(response.data.message || t("updateFailed"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || err.message || t("updateFailed"));
    }
  };
  const handleNewKidChange = (e) => {
    const { name, value } = e.target;
    setNewKid((prev) => ({ ...prev, [name]: value }));
  }
  const handleAddKid = async () => {
    if (!newKid.firstName || !newKid.lastName || !newKid.birthDate) {
      alert(t("fillAllKidFields"));
      return;
    }
  
    const birthDateObj = new Date(newKid.birthDate);
    const ageDifMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  
    if (age >= 18) {
      alert(t("kidMustBeUnder18"));
      return;
    }
  
    if (!user || !user.id) {
      alert(t("userNotAuthenticated"));
      return;
    }
  
    try {
      // Appel API pour ajouter l'enfant
      const response = await apiRequest.post(`/patients/${user.id}/kids`, newKid);
  
      // Si succès, mettre à jour la liste locale
      setKids((prev) => [...prev, response.data.kid]);
  
      // Réinitialiser le formulaire
      setNewKid({ firstName: "", lastName: "", birthDate: "" });
  
      alert(t("kidAddedSuccess"));
    } catch (error) {
      console.error("Erreur ajout enfant :", error);
      alert(error.response?.data?.message || t("kidAddFailed"));
    }
  };
  
  return (
    <div className="flex h-screen text-sky-400">
      {/* Colonne de gauche */}
      <div className="flex flex-col gap-6 w-1/4 p-8 relative">
        <div className="absolute top-6 right-6">
          <FaUser size={48} className="text-sky-400" />
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition cursor-pointer"
            onClick={() => handleChoiceClick("profile")}
          >
            <span className="text-sky-400 hover:underline">{t("profile")}</span>
          </div>
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition cursor-pointer"
            onClick={() => handleChoiceClick("consultPatientFolder")}
          >
            {t('consultMedicalFolder')}
          </div>
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition cursor-pointer"
            onClick={() => handleChoiceClick("appointments")}
          >
            {t('Rendez-vous')}
          </div>
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition cursor-pointer"
            onClick={() => handleChoiceClick("settings")}
          >
            {t('Settings')}
          </div>
        </div>
      </div>

      {/* Contenu à droite */}
      <div className="w-3/4 p-8 overflow-auto">
        {activeChoice === "profile" && (
          <div className="flex justify-center items-center h-full p-8">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg text-black">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Mise à jour des informations personnelles
              </h2>

              <div className="flex flex-col gap-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">Photo de profil</h3>
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {(formData.avatar || user.avatar) ? (
                      <img
                        src={
                          formData.avatar
                            ? URL.createObjectURL(formData.avatar)
                            : `http://localhost:8800${user.avatar}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400 text-6xl" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleChange}
                    accept="image/*"
                    className="mt-2"
                  />
                </div>

                {/* Civilité */}
                <div className="flex items-center gap-6">
                  <label className="font-semibold">Civilité :</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        id="masculin"
                        name="civilite"
                        value="masculin"
                        checked={formData.civilite === "masculin"}
                        onChange={handleChange}
                      />
                      <span>Masculin</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        id="feminin"
                        name="civilite"
                        value="feminin"
                        checked={formData.civilite === "feminin"}
                        onChange={handleChange}
                      />
                      <span>Féminin</span>
                    </label>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-center gap-4">
                  <label className="font-semibold">Numéro de téléphone :</label>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt />
                    <input
                      type="text"
                      name="numeroDeTelephone"
                      value={formData.numeroDeTelephone}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>
                </div>

                {/* Email (non modifiable) */}
                <div className="flex items-center gap-4">
                  <label className="font-semibold">Adresse e-mail :</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-2 py-1"
                    disabled
                  />
                </div>

                {/* Bouton Enregistrer */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSave}
                    className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
                    {/* Section Ajout Enfants */}
<div className="mt-10 p-6 border-2 border-sky-400 rounded-lg bg-sky-50 text-black max-w-xl mx-auto">
  <h3 className="text-xl font-semibold mb-4">{t("addChild")}</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <input
      type="text"
      name="firstName"
      placeholder={t("firstName")}
      value={newKid.firstName}
      onChange={handleNewKidChange}
      className="border border-gray-300 rounded px-3 py-2"
    />
    <input
      type="text"
      name="lastName"
      placeholder={t("lastName")}
      value={newKid.lastName}
      onChange={handleNewKidChange}
      className="border border-gray-300 rounded px-3 py-2"
    />
    <input
      type="date"
      name="birthDate"
      placeholder={t("birthDate")}
      value={newKid.birthDate}
      onChange={handleNewKidChange}
      className="border border-gray-300 rounded px-3 py-2"
      max={new Date().toISOString().split("T")[0]} // date max aujourd'hui
    />
  </div>

  <button
    onClick={handleAddKid}
    className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 transition"
  >
    {t("add")}
  </button>

  {/* Liste des enfants ajoutés */}
  {kids.length > 0 && (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">{t("childrenAdded")}</h4>
      <ul className="list-disc list-inside space-y-1">
        {kids.map((kid, index) => (
          <li key={index}>
            {kid.firstName} {kid.lastName} - {new Date(kid.birthDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
            </div>
          </div>
        )}

        {activeChoice === "consultPatientFolder" && <ConsultPatientFolder />}
        {activeChoice === "appointments" && <RdvPatient />}
        {activeChoice === "settings" && (
          <div>
            <h1>Paramètres</h1>
            <p>Modifiez vos paramètres ici.</p>
          </div>
        )}

        {!activeChoice && (
          <div>
            <h1>{t('welcomeToYourDedicatedPlateform')}</h1>
            <p className="text-2xl">
              {t('ManageYourProfileHere')}
            </p>
          </div>
        )}
      </div>


    </div>
  );
}
