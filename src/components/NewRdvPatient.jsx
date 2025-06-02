import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import apiRequest from '../Api/apiRequest';
import { AuthContext } from "../Context/AuthContext";

const NewRdvPatient = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const initialFormState = {
    date: "",
    hour: "",
    typeDeVisite: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = t("dateRequired");
    if (!formData.hour) newErrors.hour = t("hourRequired");
    if (!formData.typeDeVisite) newErrors.typeDeVisite = t("typeOfVisitRequired");
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    const dateHeureISO = new Date(`${formData.date}T${formData.hour}`).toISOString();

    try {
      const response = await apiRequest.post("/rendezvous", {
        dateHeure: dateHeureISO,
        typeDeVisite: formData.typeDeVisite,
        remarks: formData.remarks,
        patientEmail: user.email, // On utilise l'email du patient connecté
      });

      alert(t("appointmentCreatedSuccess"));
      setFormData(initialFormState);
      setErrors({});
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      const message = error.response?.data?.message || t("appointmentCreationError");
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white text-black p-6 rounded-lg border border-blue-600 max-w-xl mx-auto"
    >
      {/* Date */}
      <div className="w-[30%]">
        <label className="block mb-1">{t("date")}</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-blue-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Heure */}
      <div className="w-[30%]">
        <label className="block mb-1">{t("hour")}</label>
        <input
          type="time"
          name="hour"
          value={formData.hour}
          onChange={handleChange}
          className="w-full p-2 border border-blue-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.hour && <p className="text-red-500 text-sm mt-1">{errors.hour}</p>}
      </div>

      {/* Type de visite */}
      <div>
        <label className="block mb-1">{t("typeOfVisit")}</label>
        <div className="flex space-x-6 text-blue-600">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="typeDeVisite"
              value="new"
              checked={formData.typeDeVisite === "new"}
              onChange={handleChange}
              className="cursor-pointer accent-blue-600"
            />
            <span className="text-black">{t("new")}</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="typeDeVisite"
              value="follow up"
              checked={formData.typeDeVisite === "follow up"}
              onChange={handleChange}
              className="cursor-pointer accent-blue-600"
            />
            <span className="text-black">{t("followUp")}</span>
          </label>
        </div>
        {errors.typeDeVisite && <p className="text-red-500 text-sm mt-1">{errors.typeDeVisite}</p>}
      </div>

      {/* Remarques */}
      <div>
        <label className="block mb-1">{t("remarks")}</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full p-2 border border-blue-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder={t("enterRemarks")}
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
};

export default NewRdvPatient;
