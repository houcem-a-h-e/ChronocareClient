import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaFlag, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import apiRequest from '../Api/apiRequest';
const UpdatePatientForm = () => {
  const { t } = useTranslation();
  const initialFormState = {
    dossierNumber: "",
    fullName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    chronicDisease: "false",
    diseaseDetails: "",
    weight: "",
    height: "",
    medicalDocument: null,
    patientId: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
const [currentView, setCurrentView] = useState("main");
  // Search for patients
const handleSearch = async () => {
  if (searchTerm.trim().length === 0) {
    setPatients([]);
    return;
  }

  try {
    const response = await apiRequest.get(`/dossiers/patient/${searchTerm}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(response)
    setPatients(Array.isArray(response?.data) ? response.data : []);
  } catch (error) {
    console.error("Search failed:", error);
    setPatients([]);
  }
};

  const handlePatientSelect = (patient) => {
    console.log('Selected patient:', patient); // Debug log
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
     dossierNumber: patient.dossierNumber || "", // Map dossierNumber if applicable
    patientId: patient.id,
    fullName: patient.fullName,
    phone: patient.phone || "",
    email: patient.email || "",
    address: patient.address || "", // If the patient object has an address field
    gender: patient.gender || "",  // Map gender if available
    birthDate: patient.birthDate || "", // Map birth date if applicable
    bloodGroup: patient.bloodGroup || "", // Map blood group if present
    chronicDisease: patient.chronicDisease ? "true" : "false", // Map chronicDisease,
    weight: patient.weight,
    height:patient.height
    }));
    setSearchTerm("");
    setPatients([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert(t("fileTooLarge"));
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert(t("invalidFileType"));
      return;
    }
    
    setFormData(prev => ({ ...prev, medicalDocument: file }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submission triggered'); // Debug log

  // Trim all fields
  const trimmedData = {
    ...formData,
    dossierNumber: formData.dossierNumber?.trim(),
    fullName: formData.fullName?.trim(),
    gender: formData.gender?.trim(),
    phone: formData.phone?.trim(),
    email: formData.email?.trim(),
    address: formData.address?.trim(),
    diseaseDetails: formData.diseaseDetails?.trim()
  };

  // Debug: Log current form state
  console.log('Current form data:', trimmedData);

  // Validate required fields
  const requiredFields = {
    patientId: "Patient selection is required",
    dossierNumber: "Dossier number is required",
    fullName: "Full name is required",
    gender: "Gender is required",
    birthDate: "Birth date is required",
    phone: "Phone number is required"
  };

  const newErrors = {};
  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!trimmedData[field]) {
      newErrors[field] = message;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return;
  }

  try {
    setIsSubmitting(true);
    
    const formPayload = new FormData();
    
    // Explicitly append all required fields
    formPayload.append('dossierNumber', trimmedData.dossierNumber);
    formPayload.append('fullName', trimmedData.fullName);
    formPayload.append('gender', trimmedData.gender);
    formPayload.append('birthDate', trimmedData.birthDate);
    formPayload.append('phone', trimmedData.phone);
    formPayload.append('patientId', trimmedData.patientId);
    
    // Append optional fields if they exist
    if (trimmedData.email) formPayload.append('email', trimmedData.email);
    if (trimmedData.address) formPayload.append('address', trimmedData.address);
    if (trimmedData.bloodGroup) formPayload.append('bloodGroup', trimmedData.bloodGroup);
    if (trimmedData.chronicDisease) formPayload.append('chronicDisease', trimmedData.chronicDisease);
    if (trimmedData.diseaseDetails) formPayload.append('diseaseDetails', trimmedData.diseaseDetails);
    if (trimmedData.weight) formPayload.append('weight', trimmedData.weight);
    if (trimmedData.height) formPayload.append('height', trimmedData.height);
    if (trimmedData.medicalDocument) {
      formPayload.append('medicalDocument', trimmedData.medicalDocument);
    }

    // Debug: Show FormData contents
    for (let [key, value] of formPayload.entries()) {
      console.log(key, value);
    }

    const response = await apiRequest.post('/dossiers', formPayload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('API response:', response.data);
    
    // Reset form on success
    setFormData(initialFormState);
    setSelectedPatient(null);
    setErrors({});
    alert('Dossier created successfully!');
    
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response);
    alert(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-bold text-gray-800">{t("UpdateFolder")}</h5>
          <FaFlag className="text-red-500" />
        </div>
        <div className="relative w-full md:w-64">
   <input
    type="text"
    placeholder={t("tapYourMail")}
    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }}
  />
  <FaSearch 
    className="absolute left-3 top-3 text-gray-400 cursor-pointer hover:text-blue-500"
    onClick={handleSearch}
  />
          
          {/* Patient search results */}
         {searchTerm && Array.isArray(patients) && patients.length > 0 && (
  <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
    {patients.map(patient => (
      <li 
        key={patient.id}
        onClick={() => handlePatientSelect(patient)}
        className={`p-3 hover:bg-blue-50 cursor-pointer ${
          selectedPatient?.id === patient.id ? 'bg-blue-100' : ''
        }`}
      >
        <div className="font-medium">
          {patient.nom} {patient.prenom}
        </div>
        <div className="text-sm text-gray-600">
          {patient.numeroDeTelephone} • {patient.email}
        </div>
      </li>
    ))}
  </ul>
)}
        </div>
      </div>

<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      

      </div>
      {selectedPatient && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="font-medium">
            {selectedPatient.nom} {selectedPatient.prenom}
          </div>
          <div className="text-sm text-gray-600">
            {selectedPatient.numeroDeTelephone} • {selectedPatient.email}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SECTION */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("dossierNumber")} *
                </label>
                <input
                  type="text"
                  name="dossierNumber"
                  value={formData.dossierNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.dossierNumber && <p className="text-red-500 text-sm">{errors.dossierNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("gender")} *
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{t("male")}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{t("female")}</span>
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("birthDate")} *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("phone")} *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("address")}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("medicalDocument")}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("acceptedFormats")}: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex-1 border-l border-gray-200 pl-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("bloodGroup")}
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">{t("selectBloodGroup")}</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("chronicDisease")}
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="chronicDisease"
                    value="true"
                    checked={formData.chronicDisease === "true"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{t("yes")}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="chronicDisease"
                    value="false"
                    checked={formData.chronicDisease === "false"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{t("no")}</span>
                </label>
              </div>
            </div>

            {formData.chronicDisease === "true" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("diseaseDetails")}
                </label>
                <input
                  type="text"
                  name="diseaseDetails"
                  value={formData.diseaseDetails}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("weight")} (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("height")} (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("creating")}...
              </>
            ) : (
              t("updateFolderButton")
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePatientForm;