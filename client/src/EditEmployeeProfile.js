import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./EditEmployeeProfile.css";

function EditEmployeeProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  // Initialize profile data with a fallback
  const initialProfile = location.state?.profile || {
    personalInfo: {
      name: "",
      employeeCode: "",
      idCard: "",
      phoneNumber: "",
      birthDate: "",
      nationality: "",
      ethnicity: "",
      religion: "",
      bloodType: "",
      email: "",
      jobPosition: "",
      startDate: "",
    },
    address: {
      houseNumber: "",
      moo: "",
      soi: "",
      road: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
    },
    educationalHistory: {
      highSchool: {
        schoolName: "",
        graduationDate: "",
        gpa: "",
        gradForm: "",
      },
      university: {
        faculty: "",
        degree: "",
        major: "",
        graduationDate: "",
        educationLevel: "",
        university: "",
      },
    },
  };

  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState(location.state?.photo || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile data if location.state is unavailable
  useEffect(() => {
    if (!location.state?.profile && user_id) {
      setLoading(true);
      axios
        .get(`http://localhost:3307/userprofile/${user_id}`)
        .then((response) => {
          const data = response.data;
          const transformedProfile = {
            personalInfo: {
              name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
              employeeCode: data.employeeCode || "",
              idCard: data.national_id || "",
              phoneNumber: data.phone_number || "",
              birthDate: data.birthday ? new Date(data.birthday).toISOString().split("T")[0] : "",
              nationality: data.nationality || "",
              ethnicity: data.ethnicity || "",
              religion: data.religion || "",
              bloodType: data.bloodType || "",
              email: data.email || "",
              jobPosition: "",
              startDate: "",
            },
            address: {
              houseNumber: data.houseNumber || "",
              moo: data.moo || "",
              soi: data.soi || "",
              road: data.road || "",
              subdistrict: data.subDistrict || "",
              district: data.district || "",
              province: data.province || "",
              postalCode: data.postalCode || "",
            },
            educationalHistory: {
              highSchool: {
                schoolName: data.highSchool || "",
                graduationDate: data.gradYear || "",
                gpa: data.gpa || "",
                gradForm: data.gradForm || "",
              },
              university: {
                faculty: data.faculty || "",
                degree: data.degree || "",
                major: data.major || "",
                graduationDate: data.univGradYear || "",
                educationLevel: data.educationLevel || "",
                university: data.university || "",
              },
            },
          };
          setProfile(transformedProfile);
          setPhoto(data.photo || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("Failed to load profile data. Please try again.");
          setLoading(false);
        });
    }
  }, [user_id, location.state]);

  const handleInputChange = (section, field, value, nestedSection = null) => {
    setProfile((prev) => {
      if (nestedSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [nestedSection]: {
              ...prev[section][nestedSection],
              [field]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setPhoto(photoURL);
      setPhotoFile(file);
    }
  };

  const handleSave = async () => {
    if (!profile.personalInfo.name || !profile.personalInfo.employeeCode) {
      setError("Please fill in all required fields (Name, Employee Code).");
      return;
    }

    if (!user_id) {
      setError("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Transform profile data to match backend structure
      const transformedData = {
        firstName: profile.personalInfo.name.split(" ")[0] || "",
        lastName: profile.personalInfo.name.split(" ").slice(1).join(" ") || "",
        employeeCode: profile.personalInfo.employeeCode,
        national_id: profile.personalInfo.idCard,
        phone_number: profile.personalInfo.phoneNumber,
        birthday: profile.personalInfo.birthDate || null,
        nationality: profile.personalInfo.nationality,
        ethnicity: profile.personalInfo.ethnicity,
        religion: profile.personalInfo.religion,
        bloodType: profile.personalInfo.bloodType,
        email: profile.personalInfo.email,
        houseNumber: profile.address.houseNumber,
        moo: profile.address.moo,
        soi: profile.address.soi,
        road: profile.address.road,
        subDistrict: profile.address.subdistrict,
        district: profile.address.district,
        province: profile.address.province,
        postalCode: profile.address.postalCode,
        gradForm: profile.educationalHistory.highSchool.gradForm,
        gradYear: profile.educationalHistory.highSchool.graduationDate,
        highSchool: profile.educationalHistory.highSchool.schoolName,
        gpa: profile.educationalHistory.highSchool.gpa,
        educationLevel: profile.educationalHistory.university.educationLevel,
        degree: profile.educationalHistory.university.degree,
        faculty: profile.educationalHistory.university.faculty,
        major: profile.educationalHistory.university.major,
        university: profile.educationalHistory.university.university,
        univGradYear: profile.educationalHistory.university.graduationDate,
        photo: photo || null,
      };

      // If photoFile exists, we need to handle file upload separately
      if (photoFile) {
        // Note: Backend needs to handle file uploads. For now, we'll assume photo is a URL.
        console.warn("Photo upload not fully implemented. Backend expects a string URL.");
      }

      // Send PUT request to update profile
      const response = await axios.put(
        `http://localhost:3307/userprofile/${user_id}`,
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated:", response.data);
      alert("Profile saved successfully!");
      navigate("/employeeProfile", { state: { profile } });
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employeeProfile");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  if (error && !location.state?.profile) return <div>Error: {error}</div>;

  return (
    <div className="editemployeeprofile-container">
      <aside className="editemployeeprofile-sidebar">
        <div className="editemployeeprofile-logo"></div>
        <h2 className="editemployeeprofile-sidebar-title">Employee</h2>
        <ul className="editemployeeprofile-sidebar-menu">
          <li>
            <Link
              to="/employeeProfile"
              className="editemployeeprofile-sidebar-link active"
            >
              Personal Information
            </Link>
          </li>
        </ul>
        <div className="editemployeeprofile-logout-container">
          <button
            className="editemployeeprofile-logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </aside>

      <div className="editemployeeprofile-main-content">
        <header className="editemployeeprofile-header">
          <h1 className="editemployeeprofile-header-title">Edit Employee Profile</h1>
        </header>

        <div className="editemployeeprofile-content-container">
          {error && <div className="editemployeeprofile-error">{error}</div>}

          <div className="editemployeeprofile-user-header">
            <div
              className="editemployeeprofile-user-avatar"
              style={{
                backgroundImage: photo ? `url("${photo}")` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleAddPhoto}
                className="editemployeeprofile-add-photo-input"
                style={{ display: "none" }}
                id="add-photo-input"
              />
              <label
                htmlFor="add-photo-input"
                className="editemployeeprofile-add-photo-button"
              >
                {photo ? "Change Photo" : "+ Add Photo"}
              </label>
            </div>
            <div className="editemployeeprofile-user-info">
              <input
                type="text"
                className="editemployeeprofile-user-name"
                value={profile.personalInfo.name || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "name", e.target.value)
                }
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                className="editemployeeprofile-user-position"
                value={profile.personalInfo.jobPosition || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "jobPosition", e.target.value)
                }
                placeholder="Job Position"
              />
            </div>
          </div>

          <div className="editemployeeprofile-section">
            <h2 className="editemployeeprofile-section-title">Personal Information</h2>
            <div className="editemployeeprofile-form-grid">
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Employee Code</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.employeeCode || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "employeeCode", e.target.value)
                  }
                  placeholder="Employee Code"
                  required
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">ID Card</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.idCard || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "idCard", e.target.value)
                  }
                  placeholder="ID Card Number"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Phone Number</label>
                <input
                  type="tel"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.phoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "phoneNumber", e.target.value)
                  }
                  placeholder="Phone Number"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Email</label>
                <input
                  type="email"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.email || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "email", e.target.value)
                  }
                  placeholder="Email"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Birth Date</label>
                <input
                  type="date"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.birthDate || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "birthDate", e.target.value)
                  }
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Nationality</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.nationality || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "nationality", e.target.value)
                  }
                  placeholder="Nationality"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Ethnicity</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.ethnicity || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "ethnicity", e.target.value)
                  }
                  placeholder="Ethnicity"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Religion</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.religion || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "religion", e.target.value)
                  }
                  placeholder="Religion"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Blood Type</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.personalInfo.bloodType || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "bloodType", e.target.value)
                  }
                  placeholder="Blood Type"
                />
              </div>
            </div>
          </div>

          <div className="editemployeeprofile-section">
            <h2 className="editemployeeprofile-section-title">Address</h2>
            <div className="editemployeeprofile-form-grid">
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">House Number</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.houseNumber || ""}
                  onChange={(e) =>
                    handleInputChange("address", "houseNumber", e.target.value)
                  }
                  placeholder="House Number"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Moo</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.moo || ""}
                  onChange={(e) =>
                    handleInputChange("address", "moo", e.target.value)
                  }
                  placeholder="Moo"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Soi</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.soi || ""}
                  onChange={(e) =>
                    handleInputChange("address", "soi", e.target.value)
                  }
                  placeholder="Soi"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Road</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.road || ""}
                  onChange={(e) =>
                    handleInputChange("address", "road", e.target.value)
                  }
                  placeholder="Road"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Subdistrict</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.subdistrict || ""}
                  onChange={(e) =>
                    handleInputChange("address", "subdistrict", e.target.value)
                  }
                  placeholder="Subdistrict"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">District</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.district || ""}
                  onChange={(e) =>
                    handleInputChange("address", "district", e.target.value)
                  }
                  placeholder="District"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Province</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.province || ""}
                  onChange={(e) =>
                    handleInputChange("address", "province", e.target.value)
                  }
                  placeholder="Province"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Postal Code</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.address.postalCode || ""}
                  onChange={(e) =>
                    handleInputChange("address", "postalCode", e.target.value)
                  }
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>

          <div className="editemployeeprofile-section">
            <h2 className="editemployeeprofile-section-title">Educational History</h2>
            <div className="editemployeeprofile-form-grid">
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">High School Name</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.highSchool.schoolName || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "schoolName",
                      e.target.value,
                      "highSchool"
                    )
                  }
                  placeholder="High School Name"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">High School Graduation Date</label>
                <input
                  type="date"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.highSchool.graduationDate || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "graduationDate",
                      e.target.value,
                      "highSchool"
                    )
                  }
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">High School GPA</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.highSchool.gpa || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "gpa",
                      e.target.value,
                      "highSchool"
                    )
                  }
                  placeholder="GPA"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Graduation Form</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.highSchool.gradForm || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "gradForm",
                      e.target.value,
                      "highSchool"
                    )
                  }
                  placeholder="Graduation Form"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">University Name</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.university || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "university",
                      e.target.value,
                      "university"
                    )
                  }
                  placeholder="University Name"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">University Faculty</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.faculty || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "faculty",
                      e.target.value,
                      "university"
                    )
                  }
                  placeholder="Faculty"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">University Degree</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.degree || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "degree",
                      e.target.value,
                      "university"
                    )
                  }
                  placeholder="Degree"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">University Major</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.major || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "major",
                      e.target.value,
                      "university"
                    )
                  }
                  placeholder="Major"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">Education Level</label>
                <input
                  type="text"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.educationLevel || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "educationLevel",
                      e.target.value,
                      "university"
                    )
                  }
                  placeholder="Education Level"
                />
              </div>
              <div className="editemployeeprofile-form-item">
                <label className="editemployeeprofile-label">University Graduation Date</label>
                <input
                  type="date"
                  className="editemployeeprofile-input"
                  value={profile.educationalHistory.university.graduationDate || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "educationalHistory",
                      "graduationDate",
                      e.target.value,
                      "university"
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="editemployeeprofile-action-buttons">
            <button
              className="editemployeeprofile-save-button"
              onClick={handleSave}

            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button
              className="editemployeeprofile-cancel-button"
              onClick={handleCancel}

            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployeeProfile;