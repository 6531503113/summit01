import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./addjob.css";

function Addjob() {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    num_accepted: "",
    work_formats_id: "",
    location: "",
    salary: "",
    responsibilities: "",
    deadline: "",
    genders_id: "",
    age_range: "",
    education_levels_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState([]);
  const [workFormats, setWorkFormats] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3307/genders")
      .then((response) => setGenders(response.data))
      .catch((error) => console.error("Error fetching genders:", error));

    axios
      .get("http://localhost:3307/work-formats")
      .then((response) => setWorkFormats(response.data))
      .catch((error) => console.error("Error fetching work formats:", error));

    axios
      .get("http://localhost:3307/education-levels")
      .then((response) => setEducationLevels(response.data))
      .catch((error) => console.error("Error fetching education levels:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobData.title || !jobData.description || !jobData.salary || !jobData.location || !jobData.work_formats_id) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:3307/jobs", jobData)
      .then((response) => {
        console.log(response.data);
        alert("Job added successfully!");
        navigate("/addAnnouncement");
      })
      .catch((error) => {
        console.error("Error adding job:", error);
        if (error.response) {
          console.log("Server error:", error.response.data);
          alert(`Unable to add job: ${error.response.data.error || error.response.statusText}`);
        } else {
          alert("Unable to add job: No response from server");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="addjob-container">
      <aside className="addjob-sidebar">
        <div className="addjob-logo"></div>
        <h2 className="addjob-sidebar-title">Admin</h2>
        <ul className="addjob-sidebar-menu">
          <li>
            <Link to="/personnelinformation" className="addjob-sidebar-link">
              Personal Information
            </Link>
          </li>
          <li>
            <Link to="/addAnnouncement" className="addjob-sidebar-link">
              Announcement
            </Link>
          </li>
          <h4 className="addjob-sidebar-subheader">Recruitment</h4>
          <li>
            <Link to="/jobs" className="addjob-sidebar-link">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/examinationresults" className="addjob-sidebar-link">
              Examination Results
            </Link>
          </li>
          <li>
            <Link to="/checklist" className="addjob-sidebar-link">
              Check List
            </Link>
          </li>
        </ul>
        <div className="addjob-logout-container">
          <button className="addjob-logout-button" onClick={() => navigate("/")}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="addjob-main-content">
        <header className="addjob-header">
          <h1 className="addjob-header-title">Recruiting Employees</h1>
        </header>

        <div className="addjob-form-container">
          <form className="addjob-form" onSubmit={handleSubmit}>
            <div className="addjob-row">
              <div className="addjob-section left">
                <label>Job Position</label>
                <select
                  className="short-input"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                >
                  <option value="">Select job position</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                </select>

                <label>Job Description</label>
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  placeholder="Job description"
                />

                <label>Number of Employees Accepted</label>
                <input
                  type="number"
                  name="num_accepted"
                  value={jobData.num_accepted}
                  onChange={handleChange}
                  placeholder="Number of employees"
                />

                <label>Work Format</label>
                <select
                  name="work_formats_id"
                  value={jobData.work_formats_id}
                  onChange={handleChange}
                >
                  <option value="">Select format</option>
                  {workFormats.map((wf) => (
                    <option key={wf.id} value={wf.id}>
                      {wf.work_format_name}
                    </option>
                  ))}
                </select>

                <label>Work Location</label>
                <select
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                >
                  <option value="">Select location</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Rai">Chiang Rai</option>
                </select>

                <label>Salary (Baht)</label>
                <input
                  type="number"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="Salary"
                />

                <label>Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={jobData.responsibilities}
                  onChange={handleChange}
                  placeholder="Responsibilities"
                />
              </div>

              <div className="addjob-section right">
                <label>Features</label>

                <label>Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                />

                <label>Gender</label>
                <select
                  name="genders_id"
                  value={jobData.genders_id}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gender_name}
                    </option>
                  ))}
                </select>

                <label>Age Range</label>
                <input
                  type="text"
                  name="age_range"
                  value={jobData.age_range}
                  onChange={handleChange}
                  placeholder="Age range"
                />

                <label>Education Level</label>
                <select
                  name="education_levels_id"
                  value={jobData.education_levels_id}
                  onChange={handleChange}
                >
                  <option value="">Select Education Level</option>
                  {educationLevels.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.education_level_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="addjob-buttons">
              <button
                type="submit"
                className="addjob-save-button"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Addjob;