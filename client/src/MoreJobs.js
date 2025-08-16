import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "./MoreJobs.css";

function MoreJobs() {
  const navigate = useNavigate();
  const { user_id, job_id } = useParams(); // เปลี่ยนจาก applicantId เป็น user_id และ job_id
  const [applicantData, setApplicantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Params:", { user_id, job_id }); // Debug: ตรวจสอบพารามิเตอร์

    if (!user_id || !job_id) {
      setError("Missing user_id or job_id in URL");
      setLoading(false);
      return;
    }

    const fetchApplicantData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3307/documentsna/${user_id}/${job_id}`
        );
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("ข้อมูลที่ได้รับจาก backend:", data);
        setApplicantData(data);
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูล:", error);
        setError(error.message);
        setApplicantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantData();
  }, [user_id, job_id]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  if (loading) {
    return <div>Loading applicant data...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/jobs")}>Back to Jobs</button>
      </div>
    );
  }

  if (!applicantData) {
    return (
      <div>
        <p>No application data available</p>
        <button onClick={() => navigate("/jobs")}>Back to Jobs</button>
      </div>
    );
  }

  const calculateAge = (birthday) => {
    if (!birthday) return "N/A";
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const currentApplicant = {
    name: `${applicantData.firstName} ${applicantData.lastName}`,
    age: calculateAge(applicantData.birthday),
    contact: applicantData.phone_number || "N/A",
    email: applicantData.email || "N/A",
    dob: applicantData.birthday ? new Date(applicantData.birthday).toLocaleDateString() : "N/A",
    portfolio: applicantData.portfolio?.url, // Use nested URL
    resume: applicantData.resume?.url,       // Use nested URL
    educationalCertificates: applicantData.certificates?.url, // Use nested URL
    education_level: applicantData.educationLevel || "N/A",
    institution: applicantData.university || "N/A",
    faculty: applicantData.faculty || "N/A",
    field_of_study: applicantData.major || "N/A",
    graduation_year: applicantData.gradYear || "N/A",
    gpa: applicantData.gpa || "N/A",
    position: applicantData.job_title,
    category: applicantData.work_format_name,
  };

  return (
    <div className="morejobs-container">
      {/* Sidebar */}
      <aside className="morejobs-sidebar">
        <div className="morejobs-logo"></div>
        <h2 className="morejobs-sidebar-title">Admin</h2>
        <ul className="morejobs-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="morejobs-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="morejobs-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="morejobs-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="morejobs-sidebar-link active">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="morejobs-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="morejobs-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="morejobs-logout-container">
          <button className="morejobs-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="morejobs-main-content">
        <header className="morejobs-header">
          <h1 className="morejobs-header-title">Applicant Information</h1>
        </header>

        <div className="morejobs-applicant-info">
          {/* Applicant Header */}
          <div className="morejobs-applicant-header">
            <div>
              <h3>{currentApplicant.name}</h3>
              <p>{currentApplicant.age} years old</p>
              <p>Position: {currentApplicant.position}</p>
              <p>Category: {currentApplicant.category}</p>
            </div>
          </div>

          {/* Applicant Details */}
          <div className="morejobs-applicant-details">
            <div className="morejobs-applicant-section">
              <h4>Personal Information</h4>
              <p>Contact number: {currentApplicant.contact}</p>
              <p>Email: {currentApplicant.email}</p>
              <p>Date of birth: {currentApplicant.dob}</p>
            </div>
            <div className="morejobs-applicant-section">
              <h4>Portfolio</h4>
              <button
                className="morejobs-portfolio-button"
                onClick={() => window.open(currentApplicant.portfolio, "_blank")}
                disabled={!currentApplicant.portfolio}
              >
                View file
              </button>
            </div>
            <div className="morejobs-applicant-section">
              <h4>Resume</h4>
              <button
                className="morejobs-portfolio-button"
                onClick={() => window.open(currentApplicant.resume, "_blank")}
                disabled={!currentApplicant.resume}
              >
                View file
              </button>
            </div>
            <div className="morejobs-applicant-section">
              <h4>Educational Certificates</h4>
              <button
                className="morejobs-portfolio-button"
                onClick={() => window.open(currentApplicant.educationalCertificates, "_blank")}
                disabled={!currentApplicant.educationalCertificates}
              >
                View file
              </button>
            </div>
            <div className="morejobs-applicant-section">
              <h4>Study</h4>
              <p>Educational level: {currentApplicant.education_level}</p>
              <p>Educational institution: {currentApplicant.institution}</p>
              <p>Faculty: {currentApplicant.faculty}</p>
            </div>
            <div className="morejobs-applicant-section">
              <h4></h4>
              <p>Field of study: {currentApplicant.field_of_study}</p>
              <p>Graduation year: {currentApplicant.graduation_year}</p>
              <p>GPA: {currentApplicant.gpa}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MoreJobs;