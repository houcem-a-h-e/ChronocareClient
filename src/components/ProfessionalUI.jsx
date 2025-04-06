import React, { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaPhoneAlt, FaUserCircle, FaUserMd } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import Chatbot from "./Chatbot";
import apiRequest from "../Api/apiRequest";
export default function ProfessionalUI() {
    const {user } = useContext(AuthContext); 
  const { t } = useTranslation();
  const [activeChoice, setActiveChoice] = useState(""); // Track the active choice

  // Function to handle when a choice is clicked
  const handleChoiceClick = (choice) => {
    setActiveChoice(choice); // Set the active choice
  }
    const [formData, setFormData] = useState({
    genre: user.civilite || "masculin",
    dateDeNaissance: new Date(user.dateDeNaissance).toISOString().split("T")[0],
    numeroDeTelephone: user.numeroDeTelephone || "",
    email: user.email || "",
    specialiteMedical: user.specialiteMedical || "",
    profilePicture: null
  });

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
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Use apiRequest to send the PATCH request
    const response = await apiRequest.patch(`/users/${user.id}/profile`, formDataToSend);

    // Check if response is okay
    if (response.status === 200) {
      alert("Profile updated successfully!");
    } else {
      throw new Error(response.data.message || "Update failed");
    }
  } catch (err) {
    console.error("Update error:", err);
    alert(err.message);
  }
};
  return (
    <div className="flex h-screen text-sky-400">
      {/* Left Column Layout for Choices */}
      <div className="flex flex-col gap-6 w-1/4 p-8">
        {/* Medical Staff Icon */}
        <div className="absolute top-6 right-6">
         <FaUserMd size={48} className="text-sky-400" />
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-6">
          {/* Choice 1 */}
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition"
            onClick={() => handleChoiceClick("profile")}
          >
            <span className="text-sky-400 hover:underline">{t("profile")}</span>
          </div>
          {/* Choice 2 */}
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition"
            onClick={() => handleChoiceClick("medicalFiles")}
          >
            Gérer les dossiers médicaux
          </div>
          {/* Choice 3 */}
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition"
            onClick={() => handleChoiceClick("appointments")}
          >
            Rendez-vous
          </div>
          {/* Choice 4 */}
          <div
            className="flex items-center justify-center h-32 bg-gray-200 text-center text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 transition"
            onClick={() => handleChoiceClick("settings")}
          >
            Paramètres
          </div>
        </div>
      </div>

      {/* Right Side for Conditional Content */}
      <div className="w-3/4 p-8">
        {/* Conditionally Render Content Based on Active Choice */}
        {activeChoice === "profile" && (
              <div className="flex justify-center items-center h-full p-8">
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Mise à jour informations personnalisées
      </h2>

      {/* Profile Section */}
      <div className="flex flex-col gap-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
  <h3 className="text-lg font-semibold mb-2">Photo de profile</h3>
<div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
  {(user.avatar || formData.profilePicture) ? (
    <img 
      src={
        formData.profilePicture ? 
        URL.createObjectURL(formData.profilePicture) : 
         `${import.meta.env.VITE_API_URL.replace('/api', '')}${user.avatar}`
      }
      alt="Profile" 
      className="w-full h-full object-cover"
    />
  ) : (
    <FaUserCircle className="text-white text-4xl" />
  )}
</div>
  <input
    type="file"
    name="profilePicture"
    onChange={handleChange}
    accept="image/*"
    className="mt-2"
  />
</div>


        {/* Genre */}
        <div className="flex items-center gap-6">
          <label className="font-semibold">Genre:</label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="masculin"
                name="civilite"
                value="masculin"
                checked={formData.genre === "masculin"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="masculin">Masculin</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="feminin"
                name="genre"
                value="feminin"
                checked={formData.genre === "feminin"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="feminin">Féminin</label>
            </div>
          </div>
        </div>

        {/* Date de Naissance */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Date de naissance:</label>
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <input
              type="date"
              name="dateDeNaissance"
              value={formData.dateDeNaissance}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-2 py-1"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Numéro de téléphone:</label>
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

        {/* Adresse E-mail */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Adresse e-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-2 py-1"
          />
        </div>

        {/* Spécialité Médicale */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Spécialité médicale:</label>
          <input
            type="text"
            name="specialiteMedical"
            value={formData.specialiteMedical}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-2 py-1"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
    </div>
        )}
        {activeChoice === "medicalFiles" && (
          <div>
            <h1>Medical Files</h1>
            <p>Manage medical files here.</p>
          </div>
        )}
        {activeChoice === "appointments" && (
          <div>
            <h1>Appointments</h1>
            <p>Manage your appointments here.</p>
          </div>
        )}
        {activeChoice === "settings" && (
          <div>
            <h1>Settings</h1>
            <p>Adjust your settings here.</p>
          </div>
        )}

        {/* If no choice is selected, display a default message */}
        {!activeChoice && (
          <div>
            <h1>Bienvenue sur votre plateforme dédiée.</h1>
            <p class="text-2xl">Gérez facilement vos dossiers patients et optimisez votre suivi médical.</p>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}
