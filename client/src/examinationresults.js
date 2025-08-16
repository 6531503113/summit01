import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./examinationresults.css";

function ExaminationResults() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Employees");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [positionOptions, setPositionOptions] = useState(["All Positions"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3307/documentsnal");
        const data = await response.json();
        console.log("Applicant information received:", data);
        if (response.ok) {
          setApplicants(data);
          const uniquePositions = [...new Set(data.map((app) => app.job_title))];
          setPositionOptions(["All Positions", ...uniquePositions]);
        } else {
          console.warn("No information found:", data.error);
          setApplicants([]);
        }
      } catch (error) {
        console.error("Error retrieving applicant information:", error);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredApplicants = applicants.filter((app) => {
    const isEmployee = app.work_format_name === "employee" || app.work_formats_id === 1;
    return (
      (selectedCategory === "Employees" ? isEmployee : !isEmployee) &&
      (selectedPosition === "All Positions" || app.job_title === selectedPosition)
    );
  });

  const handleScoreChange = (user_id, job_id, field, value) => {
    const newValue = parseInt(value) || 0;
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.user_id === user_id && applicant.job_id === job_id // Match both user_id and job_id
          ? {
              ...applicant,
              [field]: newValue,
              totalScore: field === "examScore"
                ? newValue + (applicant.interviewScore || 0)
                : (applicant.examScore || 0) + newValue,
            }
          : applicant
      )
    );
  };

  const handleStatusChange = (user_id, job_id, value) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.user_id === user_id && applicant.job_id === job_id // Match both user_id and job_id
          ? { ...applicant, status: value }
          : applicant
      )
    );
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3307/examination-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          filteredApplicants.map((applicant) => ({
            user_id: applicant.user_id,
            job_id: applicant.job_id,
            examScore: applicant.examScore,
            interviewScore: applicant.interviewScore,
            totalScore: applicant.totalScore,
            status: applicant.status,
          }))
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save examination results");
      }

      const result = await response.json();
      console.log("Result from server:", result);
      navigate("/jobs", { state: { applicants: filteredApplicants } });
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("An error occurred while recording scores.");
    }
  };

  return (
    <div className="examinationresults-container">
      <aside className="examinationresults-sidebar">
        <div className="examinationresults-logo"></div>
        <h2 className="examinationresults-sidebar-title">Admin</h2>
        <ul className="examinationresults-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="examinationresults-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="examinationresults-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="examinationresults-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="examinationresults-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/examinationresults"
              className="examinationresults-sidebar-link active"
            >
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="examinationresults-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="examinationresults-logout-container">
          <button className="examinationresults-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="examinationresults-main-content">
        <header className="examinationresults-header">
          <h1 className="examinationresults-header-title">The Result</h1>
        </header>

        <div className="examinationresults-announcement-categories">
          <div className="examinationresults-category-tabs">
            <button
              className={`examinationresults-category-tab ${selectedCategory === "Employees" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("Employees");
                setSelectedPosition("All Positions");
              }}
            >
              Employees
            </button>
            <button
              className={`examinationresults-category-tab ${selectedCategory === "Internships" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("Internships");
                setSelectedPosition("All Positions");
              }}
            >
              Internships
            </button>
          </div>
          <div className="examinationresults-position-tabs">
            <div className="examinationresults-position-dropdown">
              <button
                className="examinationresults-position-dropdown-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedPosition}
              </button>
              <div className={`examinationresults-position-dropdown-content ${dropdownOpen ? "show" : ""}`}>
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

        <div className="examinationresults-results-table-container">
          {loading ? (
            <div className="examinationresults-loading">Loading applicants...</div>
          ) : (
            <table className="examinationresults-results-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Job Title</th>
                  <th>Exam Score</th>
                  <th>Interview Score</th>
                  <th>Total Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <tr key={`${applicant.user_id}-${applicant.job_id}`}>
                      <td>{applicant.firstName} {applicant.lastName}</td>
                      <td>{applicant.job_title}</td>
                      <td>
                        <input
                          type="number"
                          value={applicant.examScore || 0}
                          onChange={(e) =>
                            handleScoreChange(applicant.user_id, applicant.job_id, "examScore", e.target.value)
                          }
                          className="examinationresults-score-input"
                          min="0"
                          max="100"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={applicant.interviewScore || 0}
                          onChange={(e) =>
                            handleScoreChange(applicant.user_id, applicant.job_id, "interviewScore", e.target.value)
                          }
                          className="examinationresults-score-input"
                          min="0"
                          max="100"
                        />
                      </td>
                      <td>{applicant.totalScore || 0}</td>
                      <td>
                        <select
                          value={applicant.status || "Fail"}
                          onChange={(e) =>
                            handleStatusChange(applicant.user_id, applicant.job_id, e.target.value)
                          }
                          className="examinationresults-status-select"
                        >
                          <option value="Fail">Fail</option>
                          <option value="Pass">Pass</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      {selectedPosition === "All Positions"
                        ? "Please select a position to view applicants."
                        : "No applicants available for this selection."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {!loading && filteredApplicants.length > 0 && (
            <button className="examinationresults-submit-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExaminationResults;