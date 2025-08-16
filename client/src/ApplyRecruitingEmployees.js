import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./ApplyRecruitingEmployees.css";

function ApplyRecruitingEmployees() {
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};

  const [resumeFile, setResumeFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [educationalCertificates, setEducationalCertificates] = useState(null);
  const [fileUrls, setFileUrls] = useState({ resume: null, portfolio: null, certificates: null });

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/morerecruitingemployees", { state: { job } });
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        alert("Please upload a PDF, DOC, or DOCX file only.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must not exceed 5MB.");
        return;
      }
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !portfolioFile) {
      alert("Please upload both resume and portfolio.");
      return;
    }

    const confirmSubmit = window.confirm("Are you sure you want to submit the documents?");
    if (confirmSubmit) {
      const formDataToSend = new FormData();
      formDataToSend.append("resume", resumeFile);
      formDataToSend.append("portfolio", portfolioFile);
      if (educationalCertificates) {
        formDataToSend.append("educationalCertificates", educationalCertificates);
      }
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        alert("Please log in to upload documents.");
        navigate("/");
        return;
      }
      formDataToSend.append("user_id", user_id);

      if (!job || !job.id) {
        alert("Job information is missing. Please select a job to apply for.");
        navigate("/recruitingemployees"); // หรือหน้าที่เหมาะสม
        return;
      }
      formDataToSend.append("job_id", job.id);

      try {
        const apiUrl = "http://localhost:3307/apply";
        console.log("Sending data to:", apiUrl);
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formDataToSend,
        });
        const result = await response.json();
        if (response.ok) {
          alert("Documents uploaded successfully!");
          setFileUrls({
            resume: result.files.resume,
            portfolio: result.files.portfolio,
            certificates: result.files.certificates,
          });
        } else {
          alert(result.message || "Unable to upload documents. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading documents:", error);
        alert("An error occurred while uploading: " + error.message);
      }
    }
  };

  return (
    <div className="ApplyRecruitingEmployees-container">
      <aside className="ApplyRecruitingEmployees-sidebar">
        <div className="ApplyRecruitingEmployees-logo"></div>
        <h2 className="ApplyRecruitingEmployees-sidebar-title">User</h2>
        <ul className="ApplyRecruitingEmployees-sidebar-menu">
          <h4 className="ApplyRecruitingEmployees-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/recruitingemployees" className={`ApplyRecruitingEmployees-sidebar-link ${
                location.pathname === "/recruitingemployees" ||
                location.pathname === "/morerecruitingemployees" ||
                location.pathname === "/applyrecruitingemployees" 
                  ? "active"
                  : ""
              }`}>
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className={`ApplyRecruitingEmployees-sidebar-link ${
                location.pathname === "/recruitinginternships" ||
                location.pathname === "/morerecruitinginternships" ||
                location.pathname === "/applyrecruitinginternships"
  ? "active" : ""
              }`}>
              Recruiting internships
            </Link>
          </li>
          <h4 className="ApplyRecruitingEmployees-sidebar-subheader">Status</h4>
          <li>
            <Link to="/applicantstatus" className={`ApplyRecruitingEmployees-sidebar-link ${
                location.pathname === "/applicantstatus" ? "active" : ""
              }`}>
              Applicant status
            </Link>
          </li>
          <h4 className="ApplyRecruitingEmployees-sidebar-subheader">Information</h4>
          <li>
            <Link to="/profile" className={`ApplyRecruitingEmployees-sidebar-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}>
              Profile
            </Link>
          </li>
        </ul>
        <div className="ApplyRecruitingEmployees-logout-container">
          <button className="ApplyRecruitingEmployees-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="ApplyRecruitingEmployees-main-content">
        <header className="ApplyRecruitingEmployees-header">
          <h1 className="ApplyRecruitingEmployees-header-title">
            Upload Documents {job ? `for ${job.title}` : ""}
          </h1>
        </header>

        <div className="ApplyRecruitingEmployees-form-container">
          <h2 className="ApplyRecruitingEmployees-section-title">Required Documents</h2>
          <form onSubmit={handleSubmit}>
            <div className="ApplyRecruitingEmployees-form-group">
              <label className="ApplyRecruitingEmployees-form-label">Resume *</label>
              <div className="ApplyRecruitingEmployees-file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setResumeFile)}
                  className="ApplyRecruitingEmployees-file-input"
                  id="resume-input"
                />
                <label htmlFor="resume-input" className="ApplyRecruitingEmployees-file-button">
                  Choose File
                </label>
                {resumeFile && (
                  <span className="ApplyRecruitingEmployees-file-name">{resumeFile.name}</span>
                )}
              </div>
              {fileUrls.resume && (
                <a href={fileUrls.resume} target="_blank" rel="noopener noreferrer" className="view-file-link">
                  View Resume
                </a>
              )}
            </div>

            <div className="ApplyRecruitingEmployees-form-group">
              <label className="ApplyRecruitingEmployees-form-label">Portfolio *</label>
              <div className="ApplyRecruitingEmployees-file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setPortfolioFile)}
                  className="ApplyRecruitingEmployees-file-input"
                  id="portfolio-input"
                />
                <label htmlFor="portfolio-input" className="ApplyRecruitingEmployees-file-button">
                  Choose File
                </label>
                {portfolioFile && (
                  <span className="ApplyRecruitingEmployees-file-name">{portfolioFile.name}</span>
                )}
              </div>
              {fileUrls.portfolio && (
                <a href={fileUrls.portfolio} target="_blank" rel="noopener noreferrer" className="view-file-link">
                  View Portfolio
                </a>
              )}
            </div>

            <div className="ApplyRecruitingEmployees-form-group">
              <label className="ApplyRecruitingEmployees-form-label">Educational Certificate</label>
              <div className="ApplyRecruitingEmployees-file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setEducationalCertificates)}
                  className="ApplyRecruitingEmployees-file-input"
                  id="educational-certificates-input"
                />
                <label htmlFor="educational-certificates-input" className="ApplyRecruitingEmployees-file-button">
                  Choose File
                </label>
                {educationalCertificates && (
                  <span className="ApplyRecruitingEmployees-file-name">{educationalCertificates.name}</span>
                )}
              </div>
              {fileUrls.certificates && (
                <a href={fileUrls.certificates} target="_blank" rel="noopener noreferrer" className="view-file-link">
                  View Certificate
                </a>
              )}
            </div>
                
            <div className="ApplyRecruitingEmployees-submit-container">
              <button type="submit" className="ApplyRecruitingEmployees-submit-button">
                Submit Documents
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyRecruitingEmployees;