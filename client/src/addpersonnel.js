import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./addpersonnel.css"; 

function AddPersonnel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    position: "",
    rights: "",
    dateOfEmployment: "",
    employmentStatus: "",
    educationLevel: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",
    gpa: ""
  });

  const handleLogout = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case "name":
      case "fieldOfStudy":
      case "institution":
        processedValue = value.replace(/[^a-zA-Z\s'-]/g, "");
        break;
      case "nationalId":
        processedValue = value.replace(/[^0-9]/g, "").replace(/^-/, "");
        break;
      case "phoneNumber":
        processedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
        break;
      case "graduationYear":
        processedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
        if (processedValue.length === 4 && parseInt(processedValue) < 1900) {
          processedValue = "1900";
        }
        break;
      case "gpa":
        processedValue = value.replace(/[^0-9.]/g, "").replace(/^-/, "");
        if (processedValue.split(".").length > 2) {
          processedValue = processedValue.split(".")[0] + "." + processedValue.split(".")[1].slice(0, 2);
        }
        const numericValue = parseFloat(processedValue);
        if (!isNaN(numericValue) && numericValue > 4.0) {
          processedValue = "4.0";
        }
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3307/add-personnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("New personnel added successfully!");
        navigate("/personnelinformation");
        setFormData({
          name: "",
          nationalId: "",
          phoneNumber: "",
          email: "",
          dateOfBirth: "",
          address: "",
          position: "",
          rights: "",
          dateOfEmployment: "",
          employmentStatus: "",
          educationLevel: "",
          fieldOfStudy: "",
          institution: "",
          graduationYear: "",
          gpa: "",
        });
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error saving personnel:", error);
      alert("Failed to add personnel");
    }
  };

  return (
    <div className="addpersonnel-container">
      <aside className="addpersonnel-sidebar">
        <div className="addpersonnel-logo"></div>
        <h2 className="addpersonnel-sidebar-title">Admin</h2>
        <ul className="addpersonnel-sidebar-menu">
          <li><Link to="/personnelinformation" className="addpersonnel-sidebar-link">Personnel Information</Link></li>
          <li><Link to="/addAnnouncement" className="addpersonnel-sidebar-link">Announcement</Link></li>
          <h4 className="addpersonnel-sidebar-subheader">Recruitment</h4>
          <li><Link to="/jobs" className="addpersonnel-sidebar-link">Jobs</Link></li>
          <li><Link to="/examinationresults" className="addpersonnel-sidebar-link">Examination Results</Link></li>
          <li><Link to="/checklist" className="addpersonnel-sidebar-link">Check List</Link></li>
        </ul>
        <div className="addpersonnel-logout-container">
          <button className="addpersonnel-logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      <div className="addpersonnel-main-content">
        <header className="addpersonnel-header">
          <h1 className="addpersonnel-header-title">Personnal Information</h1>
        </header>
        <div className="addpersonnel-form-container">
          
          
          <div className="addpersonnel-form-section">
            <h2>Personal Information</h2>
            <div className="addpersonnel-form-row">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Name" 
                pattern="[A-Za-z\s'-]+" 
                title="Please enter only letters, spaces, hyphens, or apostrophes"
              />
              <input 
                type="text" 
                name="nationalId" 
                value={formData.nationalId} 
                onChange={handleInputChange} 
                placeholder="National ID" 
                pattern="[0-9]+" 
                title="Please enter only numbers"
              />
            </div>
            <div className="addpersonnel-form-row">
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
                placeholder="Phone Number" 
                pattern="[0-9]{1,10}" 
                title="Please enter up to 10 digits (numbers only)"
              />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Email Address" 
              />
            </div>
            <div className="addpersonnel-form-row">
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleInputChange} 
                placeholder="Date of Birth" 
              />
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                placeholder="Address" 
              />
            </div>
            <div className="addpersonnel-form-row">
              <select 
                name="rights" 
                value={formData.rights} 
                onChange={handleInputChange}
              >
                <option value="">User</option>
                <option value="officer">Officer</option>
                <option value="admin">Admin</option>

              </select>
              <input 
                type="text" 
                name="position" 
                value={formData.position} 
                onChange={handleInputChange} 
                placeholder="Position" 
              />
            </div>
          </div>

          <div className="addpersonnel-form-section">
            <h2>Employment Information</h2>
            <div className="addpersonnel-form-row">
              <input 
                type="date" 
                name="dateOfEmployment" 
                value={formData.dateOfEmployment} 
                onChange={handleInputChange} 
                placeholder="Date of Employment" 
              />
              <select 
                name="employmentStatus" 
                value={formData.employmentStatus} 
                onChange={handleInputChange}
              >
                <option value="">Select Status</option>
                <option value="Officer">Officer</option>
                <option value="Internships">Internships</option>
              </select>
            </div>
          </div>

          <div className="addpersonnel-form-section">
            <h2>Education</h2>
            <div className="addpersonnel-form-row">
              <select 
                name="educationLevel" 
                value={formData.educationLevel} 
                onChange={handleInputChange}
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
              </select>
              <input 
                type="text" 
                name="fieldOfStudy" 
                value={formData.fieldOfStudy} 
                onChange={handleInputChange} 
                placeholder="Field of Study" 
                pattern="[A-Za-z\s'-]+" 
                title="Please enter only letters, spaces, hyphens, or apostrophes"
              />
            </div>
            <div className="addpersonnel-form-row">
              <input 
                type="text" 
                name="institution" 
                value={formData.institution} 
                onChange={handleInputChange} 
                placeholder="Institution" 
                pattern="[A-Za-z\s'-]+" 
                title="Please enter only letters, spaces, hyphens, or apostrophes"
              />
              <input 
                type="text" 
                name="graduationYear" 
                value={formData.graduationYear} 
                onChange={handleInputChange} 
                placeholder="Graduation Year" 
                pattern="[0-9]{4}" 
                title="Please enter a 4-digit year (numbers only)"
              />
            </div>
            <div className="addpersonnel-form-row">
              <input 
                type="text" 
                name="gpa" 
                value={formData.gpa} 
                onChange={handleInputChange} 
                placeholder="GPA" 
                pattern="^[0-4](?:\.\d{0,2})?$" 
                title="Please enter a number between 0.00 and 4.00 (e.g., 3.50)"
              />
            </div>
          </div>

          <button className="addpersonnel-save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default AddPersonnel;