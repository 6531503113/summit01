import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./employeeProfile.css";

function EmployeeProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user_id = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  const defaultProfile = {
    personalInfo: {
      name: "Mr. Glomjai Larnmaksa",
      employeeCode: "123456780",
      idCard: "1760501033545",
      phoneNumber: "095-123-4567",
      birthDate: "17 Dec 2000",
      nationality: "Thai",
      ethnicity: "Thai",
      religion: "Buddhism",
      bloodType: "O",
      jobPosition: "Developer",
      startDate: "1/23/2024",
    },
    address: {
      houseNumber: "123",
      street: "Soi 5",
      subdistrict: "Klong Koresing",
      district: "Bangphai",
      province: "Prachuap Khiri Khan",
      postalCode: "77000",
    },
    educationalHistory: {
      highSchool: {
        schoolName: "ABC School",
        graduationDate: "31/12/2018",
        gpa: "2.6",
      },
      university: {
        faculty: "Applied Digital Technology",
        degree: "Bachelor's Degree",
        major: "Software Engineering",
        graduationDate: "",
      },
    },
  };

  const [profile, setProfile] = useState(location.state?.profile || defaultProfile);

  useEffect(() => {
    if (!user_id) {
      console.error("No user_id found in storage");
      navigate("/login");
      return;
    }

    console.log("Fetching profile for user_id:", user_id);
    setLoading(true);
    axios
      .get(`http://localhost:3307/userprofile/${user_id}`)
      .then((response) => {
        console.log("Response status:", response.status);
        console.log("API response data:", response.data);
        const data = response.data;

        // แปลงโครงสร้างข้อมูลจาก API (ตาราง personnelaa)
        const transformedProfile = {
          personalInfo: {
            name: `${data.firstName || "N/A"} ${data.lastName || ""}`.trim(),
            employeeCode: data.employee_card || "N/A",
            idCard: data.national_id || "N/A",
            phoneNumber: data.phone_number || "N/A",
            birthDate: data.birthday ? new Date(data.birthday).toLocaleDateString() : "N/A",
            nationality: data.nationality || "N/A",
            ethnicity: data.ethnicity || "N/A",
            religion: data.religion || "N/A",
            bloodType: data.bloodType || "N/A",
            jobPosition: "N/A", // ตาราง personnelaa ไม่มีฟิลด์นี้
            startDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A",
          },
          address: {
            houseNumber: data.houseNumber || "N/A",
            street: data.soi || data.road || "N/A",
            subdistrict: data.subDistrict || "N/A",
            district: data.district || "N/A",
            province: data.province || "N/A",
            postalCode: data.postalCode || "N/A",
          },
          educationalHistory: {
            highSchool: {
              schoolName: data.highSchool || "N/A",
              graduationDate: data.gradYear || "N/A",
              gpa: data.gpa || "N/A",
            },
            university: {
              faculty: data.faculty || "N/A",
              degree: data.degree || "N/A",
              major: data.major || "N/A",
              graduationDate: data.gradYear || "N/A",
            },
          },
        };

        setProfileData(data);
        setPhoto(data.photo || null);
        setProfile(transformedProfile);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error details:", error.response?.data, error.message);
        setError(error.message);
        setProfileData(null);
        setPhoto(null);
        setProfile(defaultProfile);
        setLoading(false);
      });
  }, [user_id, navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/EditEmployeeProfile", { state: { profile, photo } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="employeeprofile-container">
      <aside className="employeeprofile-sidebar">
        <div className="employeeprofile-logo"></div>
        <h2 className="employeeprofile-sidebar-title">Employee</h2>
        <ul className="employeeprofile-sidebar-menu">
          <li>
            <Link to="/employeeProfile" className="employeeprofile-sidebar-link active">
              Personal Information
            </Link>
          </li>
        </ul>
        <div className="employeeprofile-logout-container">
          <button className="employeeprofile-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="employeeprofile-main-content">
        <header className="employeeprofile-header">
          <h1 className="employeeprofile-header-title">Employee Profile</h1>
          <button className="employeeprofile-edit-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </header>

        <div className="employeeprofile-content-container">
          <div className="employeeprofile-user-header">
            <div
              className="employeeprofile-user-avatar"
              style={{
                backgroundImage: photo ? `url(${photo})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="employeeprofile-user-info">
              <h2 className="employeeprofile-user-name">{profile.personalInfo.name}</h2>
              <p className="employeeprofile-user-position">{profile.personalInfo.jobPosition || "N/A"}</p>
            </div>
          </div>

          <div className="employeeprofile-section">
            <h3 className="employeeprofile-section-title">Personal Information</h3>
            <div className="employeeprofile-info-table">
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Employee Code</span>
                <span className="employeeprofile-value">{profile.personalInfo.employeeCode}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">ID Card</span>
                <span className="employeeprofile-value">{profile.personalInfo.idCard}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Phone Number</span>
                <span className="employeeprofile-value">{profile.personalInfo.phoneNumber}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Birth Date</span>
                <span className="employeeprofile-value">{profile.personalInfo.birthDate}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Nationality</span>
                <span className="employeeprofile-value">{profile.personalInfo.nationality}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Ethnicity</span>
                <span className="employeeprofile-value">{profile.personalInfo.ethnicity}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Religion</span>
                <span className="employeeprofile-value">{profile.personalInfo.religion}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Blood Type</span>
                <span className="employeeprofile-value">{profile.personalInfo.bloodType}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Start Date</span>
                <span className="employeeprofile-value">{profile.personalInfo.startDate}</span>
              </div>
            </div>
          </div>

          <div className="employeeprofile-section">
            <h3 className="employeeprofile-section-title">Address</h3>
            <div className="employeeprofile-info-table">
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">House Number</span>
                <span className="employeeprofile-value">{profile.address.houseNumber}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Street</span>
                <span className="employeeprofile-value">{profile.address.street}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Subdistrict</span>
                <span className="employeeprofile-value">{profile.address.subdistrict}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">District</span>
                <span className="employeeprofile-value">{profile.address.district}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Province</span>
                <span className="employeeprofile-value">{profile.address.province}</span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">Postal Code</span>
                <span className="employeeprofile-value">{profile.address.postalCode}</span>
              </div>
            </div>
          </div>

          <div className="employeeprofile-section">
            <h3 className="employeeprofile-section-title">Educational History</h3>
            <div className="employeeprofile-info-table">
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">High School Name</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.highSchool.schoolName}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">High School Graduation Date</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.highSchool.graduationDate}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">High School GPA</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.highSchool.gpa}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">University Faculty</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.university.faculty}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">University Degree</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.university.degree}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">University Major</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.university.major}
                </span>
              </div>
              <div className="employeeprofile-info-row">
                <span className="employeeprofile-label">University Graduation Date</span>
                <span className="employeeprofile-value">
                  {profile.educationalHistory.university.graduationDate || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;