import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AddAnnouncement.css";

function AddAnnouncement() {
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [selectedWorkFormat, setSelectedWorkFormat] = useState("all");


  const fetchJobs = () => {
    axios
      .get("http://localhost:3307/jobs")
      .then((response) => {
        const jobsWithCategory = response.data.map((job, index) => ({
          ...job,
          category: index % 2 === 0 ? "Employees" : "Internships",
        }));
        setJobs(jobsWithCategory);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3307/delete-job/${jobId}`)
        .then((response) => {
          setJobs(jobs.filter((job) => job.id !== jobId));
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          alert("Error deleting job!");
        });
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleAdd = () => {
    navigate("/addjob");
  };

  const handleEdit = (jobId) => {
    navigate(`/editjob/${jobId}`);
  };

  const handleViewMore = (jobId) => {
    navigate(`/moreannouncement/${jobId}`);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      selectedWorkFormat === "all" || job.work_format_name === selectedWorkFormat
  );
  
  
  return (
    <div className="addannouncement-container">
      <aside className="addannouncement-sidebar">
        <div className="addannouncement-logo"></div>
        <h2 className="addannouncement-sidebar-title">Admin</h2>
        <ul className="addannouncement-sidebar-menu">
          <li><Link to="/personnelinformation" className="addannouncement-sidebar-link">Personnel Information</Link></li>
          <li><Link to="/addAnnouncement" className="addannouncement-sidebar-link">Announcement</Link></li>
          <h4 className="addannouncement-sidebar-subheader">Recruitment</h4>
          <li><Link to="/jobs" className="addannouncement-sidebar-link">Jobs</Link></li>
          <li><Link to="/examinationresults" className="addannouncement-sidebar-link">Examination Results</Link></li>
          <li><Link to="/checklist" className="addannouncement-sidebar-link">Check List</Link></li>
        </ul>
        <div className="addannouncement-logout-container">
          <button className="addannouncement-logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      <div className="addannouncement-main-content">
        <header className="addannouncement-header">
          <h1 className="addannouncement-header-title">Recruiting employees</h1>
        </header>
        <div className="addannouncement-categories">
  <div className="addannouncement-category-tabs">
    {[
      { label: "All", value: "all" },
      { label: "Employee", value: "employee" },
      { label: "Internship", value: "internship" },
    ].map((option) => (
      <button
        key={option.value}
        className={`addannouncement-category-tab ${
          selectedWorkFormat === option.value ? "active" : ""
        }`}
        onClick={() => setSelectedWorkFormat(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>

        <div className="addannouncement-box">
          {filteredJobs.length > 0 ? (
            <ul className="addannouncement-job-list">
              {filteredJobs.map((job) => (
                <li 
                  key={job.id} 
                  className="addannouncement-job-item"
                  onClick={() => handleViewMore(job.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{job.title}</h3>
                  <div className="addannouncement-job-details">
                    <p><strong>Job description:</strong> {job.description}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Number accepted:</strong> {job.num_accepted}</p>
                    <p><strong>Application accepted until:</strong> {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="addannouncement-job-actions">
                    <button
                      className="addannouncement-edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(job.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="addannouncement-delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="addannouncement-no-announcement">No announcements available</div>
          )}
          <button className="addannouncement-add-button" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddAnnouncement;