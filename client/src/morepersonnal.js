import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "./morepersonnal.css";

function MorePersonnel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await fetch(`http://localhost:3307/personnelaa/${id}`);
        const data = await response.json();
        if (response.ok) {
          setPersonalInfo(data);
        } else {
          console.error("Error fetching personnel:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch personnel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonnel();
  }, [id]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/editpersonnel/${id}`)
  };

  if (loading) {
    return <div className="morepersonnal-container">กำลังโหลด...</div>;
  }

  if (!personalInfo) {
    return (
      <div className="morepersonnal-container">
        <p className="morepersonnal-no-personnel">Personnel information not found</p>
      </div>
    );
  }

  return (
    <div className="morepersonnal-container">
      <aside className="morepersonnal-sidebar">
        <div className="morepersonnal-logo"></div>
        <h2 className="morepersonnal-sidebar-title">Admin</h2>
        <ul className="morepersonnal-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="morepersonnal-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="morepersonnal-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="morepersonnal-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="morepersonnal-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="morepersonnal-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="morepersonnal-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="morepersonnal-logout-container">
          <button className="morepersonnal-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="morepersonnal-main-content">
        <header className="morepersonnal-header">
          <h1 className="morepersonnal-header-title">Personnel Information</h1>
        </header>
        <div className="morepersonnal-personal-info-card">
          <div className="morepersonnal-button-container">
            <button className="morepersonnal-officer-button" onClick={handleEdit}>
              Edit
            </button>
          </div>

          <div className="morepersonnal-info-section">
            <h3>Personal Information</h3>
            <div className="morepersonnal-info-grid">
              <div className="morepersonnal-info-item">
                <strong>Name:</strong>
                <span>{personalInfo.name || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>National ID:</strong>
                <span>{personalInfo.national_id || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Address:</strong>
                <span>{personalInfo.address || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Email Address:</strong>
                <span>{personalInfo.email || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Phone Number:</strong>
                <span>{personalInfo.phone_number || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Date of Birth:</strong>
                <span>{new Date(personalInfo.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
 
              </div>
              <div className="morepersonnal-info-item">
                <strong>Position:</strong>
                <span>{personalInfo.position || "ไม่มีข้อมูล"}</span>
              </div>
            </div>
          </div>

          <div className="morepersonnal-info-section">
            <h3>Employment Information</h3>
            <div className="morepersonnal-info-grid">
              <div className="morepersonnal-info-item">
                <strong>Date of Employment:</strong>
                <span>{new Date(personalInfo.date_of_employment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Employment Status:</strong>
                <span>{personalInfo.employment_status || "ไม่มีข้อมูล"}</span>
              </div>
            </div>
          </div>

          <div className="morepersonnal-info-section">
            <h3>Education Status</h3>
            <div className="morepersonnal-info-grid">
              <div className="morepersonnal-info-item">
                <strong>Education Level:</strong>
                <span>{personalInfo.education_level || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Institution:</strong>
                <span>{personalInfo.institution || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Graduation Year:</strong>
                <span>{personalInfo.graduation_year || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>Field of Study:</strong>
                <span>{personalInfo.field_of_study || "ไม่มีข้อมูล"}</span>
              </div>
              <div className="morepersonnal-info-item">
                <strong>GPA:</strong>
                <span>{personalInfo.gpa || "ไม่มีข้อมูล"}</span>
              </div>
            </div>
          </div>

          {/* ปุ่ม Officer */}
          <div className="morepersonnal-info-item">
  <strong>Rights:</strong>
  <span>{personalInfo.rights || "ไม่มีข้อมูล"}</span>
</div>

        </div>
      </div>
    </div>
  );
}

export default MorePersonnel;