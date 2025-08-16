import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./AddDocumentApplicantStatus.css";

function AddDocumentApplicantStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicant } = location.state || {};

  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [householdFile, setHouseholdFile] = useState(null);
  const [bankBookFile, setBankBookFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/scoreapplicantstatus", { state: { applicant } });
  };

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const handleSubmit = async () => {
    if (!applicant || !applicant.user_id || !applicant.job_id) {
      alert("Missing applicant data. Please try again from Applicant Status.");
      return;
    }

    if (!nationalIdFile && !householdFile && !bankBookFile) {
      alert("Please select at least one file to submit.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("user_id", applicant.user_id);
    formData.append("job_id", applicant.job_id);
    if (nationalIdFile) formData.append("nationalId", nationalIdFile);
    if (householdFile) formData.append("household", householdFile);
    if (bankBookFile) formData.append("bankBook", bankBookFile);

    try {
      const response = await fetch("http://localhost:3307/additional-documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload documents");
      }

      const result = await response.json();
      console.log("Upload result:", result);
      alert("Documents submitted successfully!");
      navigate("/applicantStatus", { state: { applicant } });
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Fallback if no applicant data
  if (!applicant) {
    return (
      <div className="AddDocumentApplicantStatus-container">
        <aside className="AddDocumentApplicantStatus-sidebar">
          <div className="AddDocumentApplicantStatus-logo"></div>
          <h2 className="AddDocumentApplicantStatus-sidebar-title">User</h2>
          <ul className="AddDocumentApplicantStatus-sidebar-menu">
            <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Recruitment</h4>
            <li>
              <Link to="/recruitingemployees" className="AddDocumentApplicantStatus-sidebar-link">
                Recruiting employees
              </Link>
            </li>
            <li>
              <Link to="/recruitinginternships" className="AddDocumentApplicantStatus-sidebar-link">
                Recruiting internships
              </Link>
            </li>
            <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Status</h4>
            <li>
              <Link to="/applicantstatus" className="AddDocumentApplicantStatus-sidebar-link active">
                Applicant status
              </Link>
            </li>
            <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Information</h4>
            <li>
              <Link to="/profile" className="AddDocumentApplicantStatus-sidebar-link">
                Profile
              </Link>
            </li>
          </ul>
          <div className="AddDocumentApplicantStatus-logout-container">
            <button className="AddDocumentApplicantStatus-logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </aside>

        <div className="AddDocumentApplicantStatus-main-content">
          <header className="AddDocumentApplicantStatus-header">
            <h1 className="AddDocumentApplicantStatus-header-title">Additional documents</h1>
          </header>
          <div className="AddDocumentApplicantStatus-no-data">
            No applicant data available. Please return to Applicant Status.
          </div>
          <button className="AddDocumentApplicantStatus-back-button standalone" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="AddDocumentApplicantStatus-container">
      <aside className="AddDocumentApplicantStatus-sidebar">
        <div className="AddDocumentApplicantStatus-logo"></div>
        <h2 className="AddDocumentApplicantStatus-sidebar-title">User</h2>
        <ul className="AddDocumentApplicantStatus-sidebar-menu">
          <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/recruitingemployees" className="AddDocumentApplicantStatus-sidebar-link">
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className="AddDocumentApplicantStatus-sidebar-link">
              Recruiting internships
            </Link>
          </li>
          <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Status</h4>
          <li>
            <Link to="/applicantstatus" className="AddDocumentApplicantStatus-sidebar-link active">
              Applicant status
            </Link>
          </li>
          <h4 className="AddDocumentApplicantStatus-sidebar-subheader">Information</h4>
          <li>
            <Link to="/profile" className="AddDocumentApplicantStatus-sidebar-link">
              Profile
            </Link>
          </li>
        </ul>
        <div className="AddDocumentApplicantStatus-logout-container">
          <button className="AddDocumentApplicantStatus-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="AddDocumentApplicantStatus-main-content">
        <header className="AddDocumentApplicantStatus-header">
          <h1 className="AddDocumentApplicantStatus-header-title">Additional documents</h1>
        </header>

        <div className="AddDocumentApplicantStatus-modal-overlay">
          <div className="AddDocumentApplicantStatus-modal">
            <button className="AddDocumentApplicantStatus-back-button" onClick={handleBack}>
              ←
            </button>
            <div className="AddDocumentApplicantStatus-document-item">
              <span>Copy of the national ID card</span>
              <label className="AddDocumentApplicantStatus-file-label">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange(setNationalIdFile)}
                  className="AddDocumentApplicantStatus-file-input"
                />
                <span>{nationalIdFile ? nationalIdFile.name : "Select file"}</span>
              </label>
            </div>
            <div className="AddDocumentApplicantStatus-document-item">
              <span>Copy of the household registration</span>
              <label className="AddDocumentApplicantStatus-file-label">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange(setHouseholdFile)}
                  className="AddDocumentApplicantStatus-file-input"
                />
                <span>{householdFile ? householdFile.name : "Select file"}</span>
              </label>
            </div>
            <div className="AddDocumentApplicantStatus-document-item">
              <span>Copy of the bank account book</span>
              <label className="AddDocumentApplicantStatus-file-label">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange(setBankBookFile)}
                  className="AddDocumentApplicantStatus-file-input"
                />
                <span>{bankBookFile ? bankBookFile.name : "Select file"}</span>
              </label>
            </div>
            <button
              className="AddDocumentApplicantStatus-submit-button"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDocumentApplicantStatus;