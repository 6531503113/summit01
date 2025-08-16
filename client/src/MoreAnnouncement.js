import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MoreAnnouncement.css";

function MoreAnnouncement() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  const fetchJob = () => {
    axios
      .get(`http://localhost:3307/jobs/${jobId}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setJob(null);
      });
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate("/addAnnouncement");
  };

  return (
    <div className="moreannouncement-container">
      <aside className="moreannouncement-sidebar">
        <div className="moreannouncement-logo"></div>
        <h2 className="moreannouncement-sidebar-title">Admin</h2>
        <ul className="moreannouncement-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="moreannouncement-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="moreannouncement-sidebar-link active">
              Announcement
            </Link>
          </li>
          <h4 className="moreannouncement-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="moreannouncement-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="moreannouncement-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="moreannouncement-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="moreannouncement-logout-container">
          <button className="moreannouncement-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="moreannouncement-main-content">
        <header className="moreannouncement-header">
          <h1 className="moreannouncement-header-title">Announcement History</h1>
        </header>

        <div className="moreannouncement-announcement-details-box">
          <button className="moreannouncement-back-button" onClick={handleBack}>
            ←
          </button>
          {job ? (
            <section className="moreannouncement-announcement-content">
              <header className="moreannouncement-job-header">
                <h2>
                  {job.title}{" "}
                  <span className="moreannouncement-deadline">
                    Applications accepted until{" "}
                    {new Date(job.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </h2> 
              </header>

              <section className="moreannouncement-job-section">
                <h3>JOB DESCRIPTION</h3>
                <ul className="moreannouncement-job-details-list">
                  <li><strong>Number accepted:</strong> {job.num_accepted} positions</li>
                  <li><strong>Work format:</strong> {job.work_format_name} </li>
                  <li><strong>Location:</strong> {job.location}</li>
                  <li><strong>Salary (Baht):</strong> {job.salary || "20,000 - 50,000"}</li>
                  <li><strong>Working hours:</strong> {job.working_hours || "08:30 - 17:30"}</li>
                </ul>
              </section>

              <section className="moreannouncement-job-section">
                <h3>RESPONSIBILITIES</h3>
                <ul className="moreannouncement-job-details-list">
                  <li>{job.description || "Develop work systems in JAVA according to the specified standards and time."}</li>
                </ul>
              </section>

              <section className="moreannouncement-job-section">
                <h3>FEATURES</h3>
                <ul className="moreannouncement-job-details-list">
                  <li><strong>Gender:</strong> {job.gender_name || "Not specified"}</li>
                  <li><strong>Age (years):</strong> {job.age_range || "22 years and up"}</li>
                  <li><strong>Education level:</strong> {job.education_level_name || "Bachelor's degree - Doctorate degree"}</li>
                </ul>
              </section>

              <section className="moreannouncement-job-section">
                <h3>ADDITIONAL FEATURES</h3>
                <ul className="moreannouncement-job-details-list">
                  <li>{job.additional_features || "Bachelor's degree or higher in computer science or related field."}</li>
                </ul>
              </section>
            </section>
          ) : (
            <div className="moreannouncement-no-announcement">
              {job === null ? "Error loading announcement. Please try again." : "Loading announcement..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoreAnnouncement;