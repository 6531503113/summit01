import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./checklist.css";
import axios from "axios";

function CheckList() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({});
  const [applicantNames, setApplicantNames] = useState({});

  // Fetch qualified applicants on component mount
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await axios.get("http://localhost:3307/api/checklist");
        const initialChecklist = response.data.reduce((acc, applicant) => {
          acc[applicant.user_id] = {
            employee_card: applicant.employee_card,
            email_setup: applicant.email_setup,
            vpn_setup: applicant.vpn_setup,
            notebook_issued: applicant.notebook_issued,
          };
          return acc;
        }, {});
        const names = response.data.reduce((acc, applicant) => {
          acc[applicant.user_id] = applicant.name;
          return acc;
        }, {});
        setChecklist(initialChecklist);
        setApplicantNames(names);
      } catch (error) {
        console.error("Error fetching checklist:", error);
        // Fallback data if API fails
        setChecklist({
          "1": {
            employee_card: false,
            email_setup: false,
            vpn_setup: false,
            notebook_issued: false,
          },
          "2": {
            employee_card: false,
            email_setup: false,
            vpn_setup: false,
            notebook_issued: false,
          },
        });
        setApplicantNames({
          "1": "Ms. Somying Makmee",
          "2": "Mr. Sudjab Themak",
        });
      }
    };
    fetchChecklist();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleCheckboxChange = (user_id, field) => {
    setChecklist((prev) => ({
      ...prev,
      [user_id]: {
        ...prev[user_id],
        [field]: !prev[user_id][field],
      },
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:3307/api/checklist", checklist);
      alert("Checklist saved successfully!");
      navigate("/jobs");
    } catch (error) {
      console.error("Error saving checklist:", error);
      alert("Failed to save checklist");
    }
  };

  return (
    <div className="checklist-container">
      <aside className="checklist-sidebar">
        <div className="checklist-logo"></div>
        <h2 className="checklist-sidebar-title">Admin</h2>
        <ul className="checklist-sidebar-menu">
          <li><Link to="/personnelinformation" className="checklist-sidebar-link">Personnel Information</Link></li>
          <li><Link to="/addAnnouncement" className="checklist-sidebar-link">Announcement</Link></li>
          <h4 className="checklist-sidebar-subheader">Recruitment</h4>
          <li><Link to="/jobs" className="checklist-sidebar-link">Jobs</Link></li>
          <li><Link to="/examinationresults" className="checklist-sidebar-link">Examination Results</Link></li>
          <li><Link to="/checklist" className="checklist-sidebar-link active">Check List</Link></li>
        </ul>
        <div className="checklist-logout-container">
          <button className="checklist-logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      <div className="checklist-main-content">
        <header className="checklist-header">
          <h1 className="checklist-header-title">Check List </h1>
        </header>

        <div className="checklist-section">
          {Object.entries(checklist).length > 0 ? (
            <table className="checklist-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Employee Card</th>
                  <th>Email</th>
                  <th>VPN</th>
                  <th>Notebook</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(checklist).map(([user_id, fields]) => (
                  <tr key={user_id}>
                    <td>{applicantNames[user_id] || "Unknown"}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={fields.employee_card}
                        onChange={() => handleCheckboxChange(user_id, "employee_card")}
                        className="checklist-input"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={fields.email_setup}
                        onChange={() => handleCheckboxChange(user_id, "email_setup")}
                        className="checklist-input"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={fields.vpn_setup}
                        onChange={() => handleCheckboxChange(user_id, "vpn_setup")}
                        className="checklist-input"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={fields.notebook_issued}
                        onChange={() => handleCheckboxChange(user_id, "notebook_issued")}
                        className="checklist-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="checklist-no-applicants">
              No applicants qualified for the checklist.
            </div>
          )}
          <button className="checklist-save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default CheckList;