import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ApplicantStatus.css";

function ApplicantStatus() {
  const navigate = useNavigate();
  const [applicantData, setApplicantData] = useState([]);
  const user_id = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!user_id) {
        console.warn("No user_id found in sessionStorage or localStorage");
        setApplicantData([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3307/applicant-status?user_id=${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applicant status");
        }

        const data = await response.json();
        const formattedData = data.map((applicant) => ({
          position: applicant.job_title,
          examDate: applicant.exam_date ? applicant.exam_date.split("T")[0] : "Not Scheduled", // Remove time
          interviewDate: applicant.interview_date ? applicant.interview_date.split("T")[0] : "Not Scheduled", // Remove time
          interviewTime: applicant.interview_time || "Not Scheduled",
          result: applicant.status || "Pending",
          resultColor: applicant.status === "Pass" ? "green" : applicant.status === "Fail" ? "red" : "gray",
          scores: {
            examScore: applicant.exam_score || 0,
            interviewScore: applicant.interview_score || 0,
            totalScore: applicant.total_score || 0,
          },
          user_id: applicant.user_id,
          job_id: applicant.job_id,
        }));
        setApplicantData(formattedData);
      } catch (error) {
        console.error("Error fetching applicant status:", error);
        setApplicantData([]);
      }
    };

    fetchApplicantData();
  }, [user_id]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleScoreClick = (applicant) => {
    navigate("/scoreapplicantstatus", { state: { applicant } });
  };

  return (
    <div className="ApplicantStatus-container">
      <aside className="ApplicantStatus-sidebar">
        <div className="ApplicantStatus-logo"></div>
        <h2 className="ApplicantStatus-sidebar-title">User</h2>
        <ul className="ApplicantStatus-sidebar-menu">
          <h4 className="ApplicantStatus-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/recruitingemployees" className="ApplicantStatus-sidebar-link">
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className="ApplicantStatus-sidebar-link">
              Recruiting internships
            </Link>
          </li>
          <h4 className="ApplicantStatus-sidebar-subheader">Status</h4>
          <li>
            <Link to="/applicantstatus" className="ApplicantStatus-sidebar-link active">
              Applicant status
            </Link>
          </li>
          <h4 className="ApplicantStatus-sidebar-subheader">Information</h4>
          <li>
            <Link to="/profile" className="ApplicantStatus-sidebar-link">
              Profile
            </Link>
          </li>
        </ul>
        <div className="ApplicantStatus-logout-container">
          <button className="ApplicantStatus-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="ApplicantStatus-main-content">
        <header className="ApplicantStatus-header">
          <h1 className="ApplicantStatus-header-title">Applicant Status</h1>
        </header>

        <div className="ApplicantStatus-table-container">
          {applicantData.length > 0 ? (
            <table className="ApplicantStatus-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Exam Date</th>
                  <th>Interview Date</th>
                  <th>Interview Time</th>
                  <th>Result</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applicantData.map((applicant, index) => (
                  <tr key={`${applicant.user_id}-${applicant.job_id}`}>
                    <td>{applicant.position}</td>
                    <td>{applicant.examDate}</td>
                    <td>{applicant.interviewDate}</td>
                    <td>{applicant.interviewTime}</td>
                    <td style={{ color: applicant.resultColor }}>{applicant.result}</td>
                    <td>
                      <button
                        className="ApplicantStatus-score-button"
                        onClick={() => handleScoreClick(applicant)}
                      >
                        Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">
              No applicant status available for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicantStatus;