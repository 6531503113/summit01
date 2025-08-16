import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./jobs.css";

function Jobs() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("employees");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:3307/documentsna");
        const data = await response.json();
        console.log("ข้อมูลใบสมัครที่ได้รับ:", data);
        if (response.ok) {
          setApplications(data);
        } else {
          console.warn("ไม่พบข้อมูล:", data.error);
          setApplications([]);
        }
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูลใบสมัคร:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  const handleListClick = () => {
    // สมมติว่าเลือก application แรกที่มี job_id (ในชีวิตจริงอาจเลือกจาก app ที่ผู้ใช้คลิกหรือเลือกไว้)
    const job = applications.find(app => 
      (selectedCategory === "Employees" ? app.work_format_name === "employee" : app.work_format_name === "internship") &&
      (selectedPosition === "All Positions" || app.job_title === selectedPosition)
    );
  
    if (!job) {
      alert("No job selected.");
      return;
    }
  
    navigate("/listjobs", {
      state: {
        job_id: job.job_id,
        category: selectedCategory,
        job_title: job.job_title,
      },
    });
  };
  
  const handleJobCardClick = (user_id, job_id) => {
    navigate(`/morejobs/${user_id}/${job_id}`); 
  };

  const uniquePositions = [...new Set(applications.map((app) => app.job_title))];
  const positionOptions = ["All Positions", ...uniquePositions];
  const filteredApplications = applications.filter((app) => {
    const isEmployee = app.work_format_name === "employee" || app.work_formats_id === 1;
    return (
      (selectedCategory === "Employees" ? isEmployee : !isEmployee) &&
      (selectedPosition === "All Positions" || app.job_title === selectedPosition)
    );
  });

  return (
    <div className="jobs-container">
      <aside className="jobs-sidebar">
        <div className="jobs-logo"></div>
        <h2 className="jobs-sidebar-title">Admin</h2>
        <ul className="jobs-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="jobs-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="jobs-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="jobs-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="jobs-sidebar-link active">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="jobs-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="jobs-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="jobs-logout-container">
          <button className="jobs-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="jobs-main-content">
        <header className="jobs-header">
          <h1 className="jobs-header-title">Applicant Documents</h1>
          <button className="jobs-list-button" onClick={handleListClick}>
            List
          </button>
        </header>

        <div className="jobs-announcement-categories">
          <div className="jobs-category-tabs">
            <button
              className={`jobs-category-tab ${selectedCategory === "Employees" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("Employees");
                setSelectedPosition("All Positions");
              }}
            >
              Employees
            </button>
            <button
              className={`jobs-category-tab ${selectedCategory === "Internships" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("Internships");
                setSelectedPosition("All Positions");
              }}
            >
              Internships
            </button>
          </div>
          <div className="jobs-position-tabs">
            <div className="jobs-position-dropdown">
              <button
                className="jobs-position-dropdown-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedPosition}
              </button>
              <div className={`jobs-position-dropdown-content ${dropdownOpen ? "show" : ""}`}>
                {positionOptions.map((option) => (
                  <button
                    key={option}
                    className={option === selectedPosition ? "active" : ""}
                    onClick={() => {
                      setSelectedPosition(option);
                      setDropdownOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="jobs-job-status">
          {loading ? (
            <div className="jobs-loading">Loading applications...</div>
          ) : (
            <div className="jobs-job-cards">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="jobs-job-card"
                    onClick={() => handleJobCardClick(app.user_id, app.job_id)} // ส่ง user_id และ job_id
                    style={{ cursor: "pointer" }}
                  >
                    <h4>{app.firstName} {app.lastName}</h4>
                    <p className="jobs-job-description1">Position: {app.job_title}</p>
                    <p className="jobs-job-description2">Education Level: {app.educationLevel}</p>
                    <p className="jobs-job-description3">Major: {app.major}</p>
                    <p className="jobs-job-description4">
                      Year of Graduation: {app.gradYear || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="jobs-no-jobs">No applications available for this selection.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;