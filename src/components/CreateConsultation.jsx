import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaFlag } from "react-icons/fa";
import apiRequest from "../Api/apiRequest";

const CreateConsultation = () => {
  const { t } = useTranslation();

  const initialFormState = {
    consultationDate: "",
    motifConsultation: "", // correspond à reason
    doctorEmail: "",
    patientEmail: "",
    notes: "",
    prescription: "",
    AntecedentsMedicaux: "",
    symptomesObservees: [], // tableau pour les symptômes
    ExamenComplementairesDemandes: "",
    prochainRdv: "",
    attachments: null,
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim().length === 0) {
      setPatients([]);
      return;
    }

    try {
      const response = await apiRequest.get(
        `/patients/search?term=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPatients(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Search failed:", error);
      setPatients([]);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
    }));
    setSearchTerm("");
    setPatients([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, attachments: file }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation simplifiée (à adapter)
    const requiredFields = {
      consultationDate: "Consultation date is required",
      motifConsultation: "Reason is required",
      doctorEmail: "Doctor email is required",
      patientEmail: "Patient email is required",
    };
  
    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) newErrors[field] = message;
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      const formPayload = new FormData();
      formPayload.append("consultationDate", formData.consultationDate);
      formPayload.append("motifConsultation", formData.motifConsultation);
      formPayload.append("doctorEmail", formData.doctorEmail);
      formPayload.append("patientEmail", formData.patientEmail);
      formPayload.append("notes", formData.notes);
      formPayload.append("prescription", formData.prescription);
      formPayload.append("AntecedentsMedicaux", formData.AntecedentsMedicaux);
      formPayload.append("ExamenComplementairesDemandes", formData.ExamenComplementairesDemandes);
      formPayload.append("prochainRdv", formData.prochainRdv);
  
      // Symptômes en JSON string
      formPayload.append("symptomesObservees", JSON.stringify(formData.symptomesObservees));
  
      if (formData.attachments) {
        formPayload.append("medicalDocument", formData.attachments);
      }
  
      await apiRequest.post("/consultations", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      alert("Consultation créée avec succès !");
      setFormData(initialFormState);
      setSelectedPatient(null);
      setErrors({});
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-black">
      {/* Header and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-xl font-bold">{t("addNewConsultation")}</h2>
      </div>


      {/* Form Section */}
      <form onSubmit={handleSubmit}>
  <div className="space-y-6">
    <div className="w-[30%]">
      <label>{t("consultationDate")}</label>
      <input
        type="date"
        name="consultationDate"
        value={formData.consultationDate}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="w-[30%]">
      <label>{t("EmailOfTheDoctor")}</label>
      <input
        type="email"
        name="doctorEmail"
        value={formData.doctorEmail}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="w-[30%]">
      <label>{t("EmailOfThePatient")}</label>
      <input
        type="email"
        name="patientEmail"
        value={formData.patientEmail}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div>
      <label>{t("reason")}</label>
      <input
        type="text"
        name="motifConsultation"
        value={formData.motifConsultation}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="w-[30%]">
      <label>{t("symptoms")}</label>
      <div className="w-full p-2 border rounded-lg">
        {[
          "fever",
          "fatigue",
          "dryCough",
          "musclePain",
          "soreThroat",
          "lossTasteSmell",
          "skinRash",
        ].map((symptom) => (
          <div key={symptom} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="symptomesObservees"
              value={symptom}
              checked={formData.symptomesObservees.includes(symptom)}
              onChange={(e) => {
                const { checked, value } = e.target;
                setFormData((prev) => ({
                  ...prev,
                  symptomesObservees: checked
                    ? [...prev.symptomesObservees, value]
                    : prev.symptomesObservees.filter((sym) => sym !== value),
                }));
              }}
              className="cursor-pointer"
            />
            <label className="cursor-pointer">{t(symptom)}</label>
          </div>
        ))}
      </div>
    </div>

    <div>
      <label>{t("medicalAntecedents")}</label>
      <input
        type="text"
        name="AntecedentsMedicaux"
        value={formData.AntecedentsMedicaux}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div>
      <label>{t("MedicalDocumentToUpload")}</label>
      <input
        type="file"
        name="attachments"
        onChange={handleFileChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div>
      <label>{t("notes")}</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div>
      <label>{t("prescription")}</label>
      <textarea
        name="prescription"
        value={formData.prescription}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div>
      <label>{t("otherMedicalExaminations")}</label>
      <textarea
        name="ExamenComplementairesDemandes"
        value={formData.ExamenComplementairesDemandes}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="w-[30%]">
      <label>{t("nextRDV")}</label>
      <input
        type="date"
        name="prochainRdv"
        value={formData.prochainRdv}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="flex gap-x-4">
      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-lg"
        disabled={isSubmitting}
      >
        {t("add")}
      </button>
      <button
        type="button"
        className="bg-red-500 text-white py-2 px-4 rounded-lg"
        disabled={isSubmitting}
        onClick={() => {
          setFormData(initialFormState);
          setSelectedPatient(null);
          setErrors({});
        }}
      >
        {t("cancel")}
      </button>
    </div>
  </div>
</form>

    </div>
  );
};

export default CreateConsultation;
