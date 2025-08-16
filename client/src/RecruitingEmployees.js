import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./RecruitingEmployees.css";

function RecruitingEmployees() {
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
    navigate("/morerecruitingemployees", { state: { job } });
  };
  
  const filteredJobs = jobs
  .filter((job) => job.work_format_name === "employee") 
  .filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="RecruitingEmployees-container">
      <aside className="RecruitingEmployees-sidebar">
        <div className="RecruitingEmployees-logo"></div>
        <h2 className="RecruitingEmployees-sidebar-title">User</h2>
        <ul className="RecruitingEmployees-sidebar-menu">
          <h4 className="RecruitingEmployees-sidebar-subheader">Recruitment</h4>
          <li>
            <Link
              to="/recruitingemployees"
              className={`RecruitingEmployees-sidebar-link ${
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
              className={`RecruitingEmployees-sidebar-link ${
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
          <h4 className="RecruitingEmployees-sidebar-subheader">Status</h4>
          <li>
            <Link
              to="/applicantstatus"
              className={`RecruitingEmployees-sidebar-link ${
                location.pathname === "/applicantstatus" ? "active" : ""
              }`}
            >
              Applicant status
            </Link>
          </li>
          <h4 className="RecruitingEmployees-sidebar-subheader">Information</h4>
          <li>
            <Link
              to="/profile"
              className={`RecruitingEmployees-sidebar-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}
            >
              Profile
            </Link>
          </li>
        </ul>
        <div className="RecruitingEmployees-logout-container">
          <button className="RecruitingEmployees-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="RecruitingEmployees-main-content">
        <header className="RecruitingEmployees-header">
          <h1 className="RecruitingEmployees-header-title">Recruitment Employees</h1>
        </header>

        <div className="RecruitingEmployees-header-controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="RecruitingEmployees-search-input"
          />
        </div>

        <div className="RecruitingEmployees-job-list">
          {filteredJobs.map((jobs, index) => (
            <div
              key={index}
              className="RecruitingEmployees-job-item"
              onClick={() => handleJobClick(jobs)}
            >
              <h3 className="RecruitingEmployees-job-title">{jobs.title}</h3>
              <p className="RecruitingEmployees-job-detail">
                <strong>Job description:</strong> {jobs.description}
              </p>
              <p className="RecruitingEmployees-job-detail">
                <strong>Work location:</strong> {jobs.location}
              </p>
              <p className="RecruitingEmployees-job-detail">
                <strong>Salary(Baht):</strong> {jobs.salary}
              </p>
              <p className="RecruitingEmployees-job-detail">
              <strong>Number of Vacancies:</strong> {jobs.num_accepted}
              </p>
              <p className="RecruitingEmployees-job-detail">
                <strong>Working hours:</strong> {new Date(jobs.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="RecruitingEmployees-job-posted">{jobs.posted}</p>
              <button
                className="RecruitingEmployees-see-more-button"
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

export default RecruitingEmployees;