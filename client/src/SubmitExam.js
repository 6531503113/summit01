import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./SubmitExam.css";

function SubmitExam() {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedApplicants = [] } = location.state || {};

  const [applicants, setApplicants] = useState(
    selectedApplicants.length > 0
      ? selectedApplicants.map((applicant) => ({
          user_id: applicant.user_id || applicant.id, // ใช้ user_id หรือ id จาก ListJobs
          job_id: applicant.job_id,
          name: `${applicant.firstName} ${applicant.lastName}`,
          job_title: applicant.job_title,
          examDate: applicant.examDate || "",
          interviewDate: applicant.interviewDate || "",
          interviewTime: applicant.interviewTime || "",
        }))
      : []
  );

  const handleInputChange = (index, field, value) => {
    const updatedApplicants = [...applicants];
    updatedApplicants[index] = { ...updatedApplicants[index], [field]: value };
    setApplicants(updatedApplicants);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3307/exam-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          applicants.map((applicant) => ({
            user_id: applicant.user_id,
            job_id: applicant.job_id,
            examDate: applicant.examDate,
            interviewDate: applicant.interviewDate,
            interviewTime: applicant.interviewTime,
          }))
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save exam schedule");
      }

      const result = await response.json();
      console.log("Result from server:", result);
      navigate("/examinationresults", { state: { selectedApplicants: applicants } });
    } catch (error) {
      console.error("Error submitting exam schedule:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกกำหนดการสอบ");
    }
  };

  return (
    <div className="submitexam-container">
      <aside className="submitexam-sidebar">
        <div className="submitexam-logo"></div>
        <h2 className="submitexam-sidebar-title">Admin</h2>
        <ul className="submitexam-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="submitexam-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="submitexam-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="submitexam-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="submitexam-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="submitexam-sidebar-link active">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="submitexam-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="submitexam-logout-container">
          <button className="submitexam-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="submitexam-main-content">
        <header className="submitexam-header">
          <h1 className="submitexam-header-title">Schedule the Exam Date</h1>
        </header>

        <div className="submitexam-exam-schedule-box">
          {applicants.length > 0 ? (
            <>
              <table className="submitexam-exam-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Exam Date</th>
                    <th>Interview Date</th>
                    <th>Interview Time</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant, index) => (
                    <tr key={index}>
                      <td>{applicant.name}</td>
                      <td>
                        <input
                          type="date"
                          value={applicant.examDate}
                          onChange={(e) => handleInputChange(index, "examDate", e.target.value)}
                          className="submitexam-exam-input submitexam-date-input"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={applicant.interviewDate}
                          onChange={(e) => handleInputChange(index, "interviewDate", e.target.value)}
                          className="submitexam-exam-input submitexam-date-input"
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={applicant.interviewTime}
                          onChange={(e) => handleInputChange(index, "interviewTime", e.target.value)}
                          className="submitexam-exam-input submitexam-time-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="submitexam-submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </>
          ) : (
            <div className="submitexam-no-applicants">
              No applicants selected. Please go back and select at least one applicant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmitExam;