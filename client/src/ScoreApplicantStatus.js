import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./ScoreApplicantStatus.css";

function ScoreApplicantStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicant } = location.state || {}; // Applicant data from ApplicantStatus

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/applicantstatus");
  };

  const handleAddDocument = () => {
    if (applicant) {
      navigate("/adddocumentapplicantstatus", { state: { applicant } });
    } else {
      alert("No applicant data available to add documents.");
    }
  };

  // If no applicant data is passed, show a fallback message
  if (!applicant) {
    return (
      <div className="ScoreApplicantStatus-container">
        <aside className="ScoreApplicantStatus-sidebar">
          <div className="ScoreApplicantStatus-logo"></div>
          <h2 className="ScoreApplicantStatus-sidebar-title">User</h2>
          <ul className="ScoreApplicantStatus-sidebar-menu">
            <h4 className="ScoreApplicantStatus-sidebar-subheader">Recruitment</h4>
            <li>
              <Link to="/recruitingemployees" className="ScoreApplicantStatus-sidebar-link">
                Recruiting employees
              </Link>
            </li>
            <li>
              <Link to="/recruitinginternships" className="ScoreApplicantStatus-sidebar-link">
                Recruiting internships
              </Link>
            </li>
            <h4 className="ScoreApplicantStatus-sidebar-subheader">Status</h4>
            <li>
              <Link to="/applicantstatus" className="ScoreApplicantStatus-sidebar-link active">
                Applicant status
              </Link>
            </li>
            <h4 className="ScoreApplicantStatus-sidebar-subheader">Information</h4>
            <li>
              <Link to="/profile" className="ScoreApplicantStatus-sidebar-link">
                Profile
              </Link>
            </li>
          </ul>
          <div className="ScoreApplicantStatus-logout-container">
            <button className="ScoreApplicantStatus-logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </aside>

        <div className="ScoreApplicantStatus-main-content">
          <header className="ScoreApplicantStatus-header">
            <h1 className="ScoreApplicantStatus-header-title">Applicant Status</h1>
          </header>
          <div className="ScoreApplicantStatus-no-data">
            No applicant data available. Please return to Applicant Status.
          </div>
          <button className="ScoreApplicantStatus-back-button standalone" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ScoreApplicantStatus-container">
      <aside className="ScoreApplicantStatus-sidebar">
        <div className="ScoreApplicantStatus-logo"></div>
        <h2 className="ScoreApplicantStatus-sidebar-title">User</h2>
        <ul className="ScoreApplicantStatus-sidebar-menu">
          <h4 className="ScoreApplicantStatus-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/recruitingemployees" className="ScoreApplicantStatus-sidebar-link">
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className="ScoreApplicantStatus-sidebar-link">
              Recruiting internships
            </Link>
          </li>
          <h4 className="ScoreApplicantStatus-sidebar-subheader">Status</h4>
          <li>
            <Link to="/applicantstatus" className="ScoreApplicantStatus-sidebar-link active">
              Applicant status
            </Link>
          </li>
          <h4 className="ScoreApplicantStatus-sidebar-subheader">Information</h4>
          <li>
            <Link to="/profile" className="ScoreApplicantStatus-sidebar-link">
              Profile
            </Link>
          </li>
        </ul>
        <div className="ScoreApplicantStatus-logout-container">
          <button className="ScoreApplicantStatus-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="ScoreApplicantStatus-main-content">
        <header className="ScoreApplicantStatus-header">
          <h1 className="ScoreApplicantStatus-header-title">Applicant Status</h1>
        </header>

        {/* Modal Overlay for Scores */}
        <div className="ScoreApplicantStatus-modal-overlay">
          <div className="ScoreApplicantStatus-modal">
            <button className="ScoreApplicantStatus-back-button" onClick={handleBack}>
              ←
            </button>
            <h2 className="ScoreApplicantStatus-modal-title">{applicant.position}</h2>
            <div className="ScoreApplicantStatus-score-item">
              <span>Exam Score</span>
              <span>{applicant.scores.examScore || 0}</span>
            </div>
            <div className="ScoreApplicantStatus-score-item">
              <span>Interview Score</span>
              <span>{applicant.scores.interviewScore || 0}</span>
            </div>
            <div className="ScoreApplicantStatus-score-item total">
              <span>TOTAL</span>
              <span>{applicant.scores.totalScore || 0}</span>
            </div>
            <div className="ScoreApplicantStatus-score-item">
              <span>Status</span>
              <span style={{ color: applicant.resultColor }}>{applicant.result}</span>
            </div>
            <button
              className="ScoreApplicantStatus-add-document-button"
              onClick={handleAddDocument}
            >
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreApplicantStatus;