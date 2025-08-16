import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./RecruitingInternships.css";

function RecruitingInternships() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);


  const fetchJobs = () => {
    axios
      .get("http://localhost:3307/jobs")
      .then((response) => {
        setJobs(response.data); // ใช้ข้อมูลดิบจาก API โดยไม่เพิ่ม category
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  };
    useEffect(() => {
      fetchJobs();
    }, []);


  const handleLogout = () => {
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJobClick = (job) => {
    navigate("/morerecruitinginternships", { state: { job } });
  };

  const filteredJobs = jobs
  .filter((job) => job.work_format_name === "internship") // กรองเฉพาะ employee
  .filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="RecruitingInternships-container">
      <aside className="RecruitingInternships-sidebar">
        <div className="RecruitingInternships-logo"></div>
        <h2 className="RecruitingInternships-sidebar-title">User</h2>
        <ul className="RecruitingInternships-sidebar-menu">
          <h4 className="RecruitingInternships-sidebar-subheader">Recruitment</h4>
          <li>
            <Link
              to="/recruitingemployees"
              className={`RecruitingInternships-sidebar-link ${
                location.pathname === "/recruitingemployees" ||
                location.pathname === "/morerecruitingemployees" ||
                location.pathname === "/applyrecruitingemployees"
                  ? "active"
                  : ""
              }`}
            >
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link
              to="/recruitinginternships"
              className={`RecruitingInternships-sidebar-link ${
                location.pathname === "/recruitinginternships" ||
                location.pathname === "/morerecruitinginternships" ||
                location.pathname === "/applyrecruitinginternships"
                  ? "active"
                  : ""
              }`}
            >
              Recruiting internships
            </Link>
          </li>
          <h4 className="RecruitingInternships-sidebar-subheader">Status</h4>
          <li>
            <Link
              to="/applicantstatus"
              className={`RecruitingInternships-sidebar-link ${
                location.pathname === "/applicantstatus" ? "active" : ""
              }`}
            >
              Applicant status
            </Link>
          </li>
          <h4 className="RecruitingInternships-sidebar-subheader">Information</h4>
          <li>
            <Link
              to="/profile"
              className={`RecruitingInternships-sidebar-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}
            >
              Profile
            </Link>
          </li>
        </ul>
        <div className="RecruitingInternships-logout-container">
          <button className="RecruitingInternships-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="RecruitingInternships-main-content">
        <header className="RecruitingInternships-header">
          <h1 className="RecruitingInternships-header-title">Recruitment Internships</h1>
        </header>

        <div className="RecruitingInternships-header-controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="RecruitingInternships-search-input"
          />
        </div>

        <div className="RecruitingInternships-job-list">
          {filteredJobs.map((jobs, index) => (
            <div
              key={index}
              className="RecruitingInternships-job-item"
              onClick={() => handleJobClick(jobs)}
            >
              <h3 className="RecruitingInternships-job-title">{jobs.title}</h3>
              <p className="RecruitingInternships-job-detail">
                <strong>Job description:</strong> {jobs.description}
              </p>
              <p className="RecruitingInternships-job-detail">
                <strong>Work location:</strong> {jobs.location}
              </p>
              <p className="RecruitingInternships-job-detail">
                <strong>Salary(Baht):</strong> {jobs.salary}
              </p>
              <p className="RecruitingInternships-job-detail">
                <strong>Number of Vacancies:</strong> {jobs.num_accepted}
              </p>
              <p className="RecruitingInternships-job-detail">
              <strong> Closing date:</strong> {new Date(jobs.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="RecruitingInternships-job-posted">{jobs.posted}</p>
              <button
                className="RecruitingInternships-see-more-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(jobs);
                }}
              >
                See more
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecruitingInternships;