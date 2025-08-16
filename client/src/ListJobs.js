import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./ListJobs.css";

function ListJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { job_id, category, job_title } = location.state || {};
  const [applicants, setApplicants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!job_id) {
        setErrorMessage("กรุณาเลือกงานจากหน้ารายการงาน");
        setLoading(false);
        return;
      }
      try { 
        const response = await fetch(`http://localhost:3307/documentsnana/${job_id}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("ข้อผิดพลาดจาก API:", errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }
        const data = await response.json();
        console.log("ข้อมูลดิบจาก API:", data);

        const filtered = data.filter((app) => {
          const workFormat = app.work_format_name || "";
          const cat = category || "";
          const normalizedWorkFormat = workFormat.toLowerCase();
          const normalizedCat = cat.toLowerCase() === "employees" ? "employee" : "internship";
          console.log("workFormat:", normalizedWorkFormat, "category:", normalizedCat);
          return cat === "" || normalizedWorkFormat === normalizedCat;
        });
        console.log("ข้อมูลหลังกรอง:", filtered);

        setApplicants(filtered);
        setErrorMessage("");
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        setErrorMessage("ไม่พบผู้สมัครสำหรับงานนี้");
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job_id, category]);

  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const handleCheckboxChange = (applicant, isChecked) => {
    if (isChecked) {
      setSelectedApplicants([...selectedApplicants, applicant]);
    } else {
      setSelectedApplicants(
        selectedApplicants.filter((a) => a.user_id !== applicant.user_id)
      );
    }
  };
  

  const handleLogout = () => {
    navigate("/home");
  };

  const handleSubmit = async () => {
    if (selectedApplicants.length === 0) {
      alert("กรุณาเลือกผู้สมัครอย่างน้อยหนึ่งคนก่อนส่ง");
      return;
    }
  
    try {
      await Promise.all(
        applicants.map((app) => {
          const selected = selectedApplicants.some(
            (sel) => sel.user_id === app.user_id
          );
          return fetch("http://localhost:3307/api/update-selection", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },  
            body: JSON.stringify({
              user_id: app.user_id,
              job_id: job_id,
              selected,
            }),
          });
        })
      );
      navigate("/submitexam", { state: { selectedApplicants } });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะอัปเดต:", err);
      alert("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
    }
  };
  

  return (
    <div className="listjobs-container">
      <aside className="listjobs-sidebar">
        <div className="listjobs-logo"></div>
        <h2 className="listjobs-sidebar-title">Admin</h2>
        <ul className="listjobs-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="listjobs-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="listjobs-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="listjobs-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="listjobs-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="listjobs-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="listjobs-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="listjobs-logout-container">
          <button className="listjobs-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="listjobs-main-content">
        <header className="listjobs-header">
          <h1 className="listjobs-header-title">
            List of applicants for {job_title} ({category || "ทุกประเภท"})
          </h1>
        </header>
        <div className="listjobs-applicants-list">
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : applicants.length > 0 ? (
            applicants.map((app, index) => (
              <div className="listjobs-applicant" key={index}>
                <input
                  type="checkbox"
                  name="applicant"
                  id={`applicant${index + 1}`}
                  onChange={(e) => handleCheckboxChange(app, e.target.checked)}
                />
                <label htmlFor={`applicant${index + 1}`} className="listjobs-applicant-label">
                  {app.firstName} {app.lastName} | Education Level: {app.educationLevel || "N/A"} | Major: {app.major || "N/A"} | GPA: {app.gpa || "N/A"}
                </label>
                <a
                  href={app.resume?.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`listjobs-resume-link ${!app.resume?.url ? "disabled" : ""}`}
                >
                  Resume
                </a>
              </div>
            ))
          ) : (
            <p>There are no applicants for this job.</p>
          )}
        </div>

        <button className="listjobs-submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ListJobs;