import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./editpersonnel.css";

function EditPersonnel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await fetch(`http://localhost:3307/personnelaa/${id}`);
        const data = await response.json();
if (response.ok) {
  if (data.date_of_birth === "0000-00-00") data.date_of_birth = "";
  else if (data.date_of_birth) data.date_of_birth = data.date_of_birth.slice(0, 10);

  if (data.date_of_employment === "0000-00-00") data.date_of_employment = "";
  else if (data.date_of_employment) data.date_of_employment = data.date_of_employment.slice(0, 10);

  if (data.graduation_year === "0000") data.graduation_year = "";

  setFormData(data);  
}
else {
          console.error("Error fetching personnel:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch personnel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonnel();
  }, [id]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3307/personnelaa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Saved successfully!!");
        navigate(`/morepersonnel/${id}`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Failed to save personnel:", error);
      alert("An error occurred recording");
    }
  };

  const handleCancel = () => {
    navigate(`/morepersonnel/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this personnel information??")) {
      try {
        const response = await fetch(`http://localhost:3307/personnelaa/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (response.ok) {
          alert(" Personnel information successfully deleted!");
          navigate("/personnelinformation");
        } else {
          alert("Error: " + result.error);
        }
      } catch (error) {
        console.error("Failed to delete personnel:", error);
        alert("An error occurred deleting");
      }
    }
  };

  if (loading || !formData) {
    return <div className="editpersonnel-loading">กำลังโหลด...</div>;
  }

  return (
    <div className="editpersonnel-container">
      <aside className="editpersonnel-sidebar">
        <div className="editpersonnel-logo"></div>
        <h2 className="editpersonnel-sidebar-title">Admin</h2>
        <ul className="editpersonnel-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="editpersonnel-sidebar-link">
              Personnel Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="editpersonnel-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="editpersonnel-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="editpersonnel-sidebar-link">Jobs</Link>
          </li>
          <li>
            <Link to="/examinationresults" className="editpersonnel-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="editpersonnel-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="editpersonnel-logout-container">
          <button className="editpersonnel-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="editpersonnel-main-content">
        <header className="editpersonnel-header">
          <h1 className="editpersonnel-header-title">Edit Personnel Information</h1>
        </header>
        <div className="editpersonnel-form-container">
          <div className="editpersonnel-form-section">
            <h2>Personal Information</h2>
            <div className="editpersonnel-form-grid">
              <div className="editpersonnel-form-item">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Name"
                  pattern="[A-Za-z\s'-]+"
                  title="Please enter only letters, spaces, hyphens, or apostrophes"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>National ID</label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id || ""}
                  onChange={handleInputChange}
                  placeholder="National ID"
                  pattern="[0-9]+"
                  title="Please enter only numbers"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  pattern="[0-9]{1,10}"
                  title="Please enter up to 10 digits (numbers only)"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleInputChange}
                  placeholder="Date of Birth"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  placeholder="Address"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Rights</label>
                <select
                  name="rights"
                  value={formData.rights || ""}
                  onChange={handleInputChange}
                >
                  <option value="">User</option>
                  <option value="admin">Admin</option>
                  <option value="officer">Officer</option>
                  
                </select>
              </div>
              <div className="editpersonnel-form-item">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleInputChange}
                  placeholder="Position"
                />
              </div>
            </div>
          </div>

          <div className="editpersonnel-form-section">
            <h2>Employment Information</h2>
            <div className="editpersonnel-form-grid">
              <div className="editpersonnel-form-item">
                <label>Date of Employment</label>
                <input
                  type="date"
                  name="date_of_employment"
                  value={formData.date_of_employment || ""}
                  onChange={handleInputChange}
                  placeholder="Date of Employment"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Employment Status</label>
                <select
                  name="employment_status"
                  value={formData.employment_status || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Officer">Officer</option>
                  <option value="Internships">Internships</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
          </div>

          <div className="editpersonnel-form-section">
            <h2>Education</h2>
            <div className="editpersonnel-form-grid">
              <div className="editpersonnel-form-item">
                <label>Education Level</label>
                <select
                  name="education_level"
                  value={formData.education_level || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                </select>
              </div>
              <div className="editpersonnel-form-item">
                <label>Field of Study</label>
                <input
                  type="text"
                  name="field_of_study"
                  value={formData.field_of_study || ""}
                  onChange={handleInputChange}
                  placeholder="Field of Study"
                  pattern="[A-Za-z\s'-]+"
                  title="Please enter only letters, spaces, hyphens, or apostrophes"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution || ""}
                  onChange={handleInputChange}
                  placeholder="Institution"
                  pattern="[A-Za-z\s'-]+"
                  title="Please enter only letters, spaces, hyphens, or apostrophes"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>Graduation Year</label>
                <input
                  type="text"
                  name="graduation_year"
                  value={formData.graduation_year || ""}
                  onChange={handleInputChange}
                  placeholder="Graduation Year"
                  pattern="[0-9]{4}"
                  title="Please enter a 4-digit year (numbers only)"
                />
              </div>
              <div className="editpersonnel-form-item">
                <label>GPA</label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa || ""}
                  onChange={handleInputChange}
                  placeholder="GPA"
                  pattern="^[0-4](?:\.\d{0,2})?$"
                  title="Please enter a number between 0.00 and 4.00 (e.g., 3.50)"
                />
              </div>
            </div>
          </div>

          <div className="editpersonnel-button-group">
            <button className="editpersonnel-cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="editpersonnel-delete-button" onClick={handleDelete}>
              Delete
            </button>
            <button className="editpersonnel-save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPersonnel;