import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const user_id = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const imageUrl = `/uploads/${fileName}`; // ส่ง URL ที่สามารถใช้งานได้
  const photoURL = URL.createObjectURL(photoBlob);

    useEffect(() => {
      if (user_id) {
        fetch(`http://localhost:3307/userprofile/${user_id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("User not found");
            }
            return response.json();
          })
          .then((data) => {
            setProfileData(data);
            setPhoto(data.photo);
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            setProfileData(null);
            setPhoto(null);
          });
      } else {
        console.error("No user_id found in storage"); // บรรทัด 35 ที่เกิด error
        setProfileData(null);
        setPhoto(null);
      }
    }, [user_id]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id"); // ลบ user_id เมื่อ logout
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleEditProfile = () => {
    if (profileData) {
      navigate("/editprofile", { state: { profileData, photo } });
    }
  };


  if (!profileData) {
    return (
      <div className="Profile-container">
        <aside className="Profile-sidebar">
          <div className="Profile-logo"></div>
          <h2 className="Profile-sidebar-title">User</h2>
          <ul className="Profile-sidebar-menu">
            <h4 className="Profile-sidebar-subheader">Recruitment</h4>
            <li>
              <Link to="/recruitingemployees" className="Profile-sidebar-link">
                Recruiting employees
              </Link>
            </li>
            <li>
              <Link to="/recruitinginternships" className="Profile-sidebar-link">
                Recruiting internships
              </Link>
            </li>
            <h4 className="Profile-sidebar-subheader">Status</h4>
            <li>
              <Link to="/applicantstatus" className="Profile-sidebar-link">
                Applicant status
              </Link>
            </li>
            <h4 className="Profile-sidebar-subheader">Information</h4>
            <li>
              <Link to="/profile" className="Profile-sidebar-link active">
                Profile
              </Link>
            </li>
          </ul>
          <div className="Profile-logout-container">
            <button className="Profile-logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </aside>
        <div className="Profile-main-content">
          <header className="Profile-header">
            <h1 className="Profile-header-title">Profile</h1>
          </header>
          <div className="Profile-content-container">
            <p>{user_id ? "Loading profile data..." : "Please log in to view your profile."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Profile-container">
      <aside className="Profile-sidebar">
        <div className="Profile-logo"></div>
        <h2 className="Profile-sidebar-title">User</h2>
        <ul className="Profile-sidebar-menu">
          <h4 className="Profile-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/recruitingemployees" className="Profile-sidebar-link">
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className="Profile-sidebar-link">
              Recruiting internships
            </Link>
          </li>
          <h4 className="Profile-sidebar-subheader">Status</h4>
          <li>
            <Link to="/applicantstatus" className="Profile-sidebar-link">
              Applicant status
            </Link>
          </li>
          <h4 className="Profile-sidebar-subheader">Information</h4>
          <li>
            <Link to="/profile" className="Profile-sidebar-link active">
              Profile
            </Link>
          </li>
        </ul>
        <div className="Profile-logout-container">
          <button className="Profile-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="Profile-main-content">
        <header className="Profile-header">
          <h1 className="Profile-header-title">Profile</h1>
          <button className="Profile-edit-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </header>

        <div className="Profile-content-container">
          {/* User Header */}
          <div className="Profile-user-header">
            <div
              className="Profile-user-avatar"
              style={{
                backgroundImage: photo ? `url(${photo})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="Profile-user-info">
              <h2 className="Profile-user-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="Profile-section">
            <h2 className="Profile-section-title">Personal Information</h2>
            <div className="Profile-form-grid">
              <div className="Profile-form-item">
                <label className="Profile-label">Name</label>
                <div className="Profile-input">{profileData.firstName}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Last name</label>
                <div className="Profile-input">{profileData.lastName}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">ID Card</label>
                <div className="Profile-input">{profileData.national_id}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Phone Number</label>
                <div className="Profile-input">{profileData.phone_number}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Birthday</label>
                <div className="Profile-input">{profileData.birthday}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Nationality</label>
                <div className="Profile-input">{profileData.nationality}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Ethnicity</label>
                <div className="Profile-input">{profileData.ethnicity}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Religion</label>
                <div className="Profile-input">{profileData.religion}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Blood Type</label>
                <div className="Profile-input">{profileData.bloodType}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Email</label>
                <div className="Profile-input">{profileData.email}</div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="Profile-section">
            <h2 className="Profile-section-title">Address</h2>
            <div className="Profile-form-grid">
              <div className="Profile-form-item">
                <label className="Profile-label">House Number</label>
                <div className="Profile-input">{profileData.houseNumber}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Moo</label>
                <div className="Profile-input">{profileData.moo}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Soi</label>
                <div className="Profile-input">{profileData.soi || "-"}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Road</label>
                <div className="Profile-input">{profileData.road}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Sub-district</label>
                <div className="Profile-input">{profileData.subDistrict}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">District</label>
                <div className="Profile-input">{profileData.district}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Province</label>
                <div className="Profile-input">{profileData.province}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Postal Code</label>
                <div className="Profile-input">{profileData.postalCode}</div>
              </div>
            </div>
          </div>

          {/* Educational History Section */}
          <div className="Profile-section">
            <h2 className="Profile-section-title">Educational History</h2>
            <div className="Profile-form-grid">
              <div className="Profile-form-item">
                <label className="Profile-label">Graduate Form</label>
                <div className="Profile-input">{profileData.gradForm}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Year of Graduation</label>
                <div className="Profile-input">{profileData.gradYear}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">High School</label>
                <div className="Profile-input">{profileData.highSchool}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">GPA</label>
                <div className="Profile-input">{profileData.gpa}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Education Level</label>
                <div className="Profile-input">{profileData.educationLevel}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Degree</label>
                <div className="Profile-input">{profileData.degree}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Faculty</label>
                <div className="Profile-input">{profileData.faculty}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">Major</label>
                <div className="Profile-input">{profileData.major}</div>
              </div>
              <div className="Profile-form-item">
                <label className="Profile-label">University</label>
                <div className="Profile-input">{profileData.university}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;