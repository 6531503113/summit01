import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./addjob.css";

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedWorkFormat, setSelectedWorkFormat] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
  const [deadline, setDeadline] = useState('');

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    num_accepted: "",
    work_formats_name: "",
    location: "",
    salary: "",
    responsibilities: "",
    deadline: "",
    genders_name: "",
    age_range: "",
    education_levels_name: "",
  });

  const [genders, setGenders] = useState([]);
  const [workFormats, setWorkFormats] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);



  useEffect(() => {
    axios.get("http://localhost:3307/genders").then((res) => setGenders(res.data));
    axios.get("http://localhost:3307/work-formats").then((res) => setWorkFormats(res.data));
    axios.get("http://localhost:3307/education-levels").then((res) => setEducationLevels(res.data));
    axios
      .get(`http://localhost:3307/jobs/${jobId}`)
      .then((res) => {
        const formattedDeadline = new Date(res.data.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        setJobData({
          ...res.data,
          deadline: formattedDeadline,
        });
      })
      .catch((err) => console.error("Error fetching job data:", err));
  }, [jobId]);
  
  
  useEffect(() => {
    if (jobData) {

      const workFormat = workFormats.find(wf => wf.work_format_name === jobData.work_formats_name);
      if (workFormat) {
        setSelectedWorkFormat(workFormat.id);
      }

      const gender = genders.find(g => g.gender_name === jobData.gender_name);
      if (gender) {
        setSelectedGender(gender.id);
      }

      const educationLevel = educationLevels.find(el => el.education_level_name === jobData.education_levels_name);
      if (educationLevel) {
        setSelectedEducationLevel(educationLevel.id);
      }

      setDeadline(jobData.deadline); 
    }
  }, [jobData, workFormats, genders, educationLevels]);

  const handleWorkFormatChange = (e) => {
    setSelectedWorkFormat(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleEducationLevelChange = (e) => {
    setSelectedEducationLevel(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobData.title || !jobData.description || !jobData.salary || !jobData.location || !jobData.work_formats_id) {
      alert("Please fill in all required fields");
      return;
    }

    axios
      .put(`http://localhost:3307/update-job/${jobId}`, jobData)
      .then(() => {
        alert("Job updated successfully!");
        navigate("/addAnnouncement");
      })
      .catch((err) => {
        console.error("Error updating job:", err);
        alert("Unable to update job");
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3307/genders")
      .then((res) => {
        console.log("Genders data:", res.data);  // ตรวจสอบข้อมูลที่ได้รับ
        setGenders(res.data);
      })
      .catch((err) => console.error("Error fetching genders:", err));
  
    axios.get("http://localhost:3307/work-formats")
      .then((res) => {
        console.log("Work Formats data:", res.data);  // ตรวจสอบข้อมูลที่ได้รับ
        setWorkFormats(res.data);
      })
      .catch((err) => console.error("Error fetching work formats:", err));
  
    axios.get("http://localhost:3307/education-levels")
      .then((res) => {
        console.log("Education Levels data:", res.data);  // ตรวจสอบข้อมูลที่ได้รับ
        setEducationLevels(res.data);
      })
      .catch((err) => console.error("Error fetching education levels:", err));
  
    axios.get(`http://localhost:3307/jobs/${jobId}`)
      .then((res) => {
        console.log("Job data:", res.data);  // ตรวจสอบข้อมูลที่ได้รับ
        setJobData(res.data);
      })
      .catch((err) => console.error("Error fetching job data:", err));
  }, [jobId]);
  

  return (
    <div className="addjob-container">
      <aside className="addjob-sidebar">
        <div className="addjob-logo"></div>
        <h2 className="addjob-sidebar-title">Admin</h2>
        <ul className="addjob-sidebar-menu">
          <li><Link to="/personnelinformation" className="addjob-sidebar-link">Personnel Information</Link></li>
          <li><Link to="/addAnnouncement" className="addjob-sidebar-link">Announcement</Link></li>
          <h4 className="addjob-sidebar-subheader">Recruitment</h4>
          <li><Link to="/jobs" className="addjob-sidebar-link">Jobs</Link></li>
          <li><Link to="/examinationresults" className="addjob-sidebar-link">Examination Results</Link></li>
          <li><Link to="/checklist" className="addjob-sidebar-link">Check List</Link></li>
        </ul>
        <div className="addjob-logout-container">
          <button className="addjob-logout-button" onClick={() => navigate("/")}>Log Out</button>
        </div>
      </aside>

      <div className="addjob-main-content">
        <header className="addjob-header">
          <h1 className="addjob-header-title">Edit Job</h1>
        </header>
        <div className="addjob-form-container">
          <form className="addjob-form" onSubmit={handleSubmit}>
            <div className="addjob-row">
              <div className="addjob-section left">
                <label>Job Position</label>
                <select className="short-input" name="title" value={jobData.title} onChange={handleChange}>
                  <option value="">Select job position</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                </select>

                <label>Job Description</label>
                <textarea name="description" value={jobData.description} onChange={handleChange} placeholder="Job description" />

                <label>Number of Employees Accepted</label>
                <input type="number" name="num_accepted" value={jobData.num_accepted} onChange={handleChange} placeholder="Number of employees" />

                <label>Work Format</label>
                <select
        id="workFormat"
        value={selectedWorkFormat}
        onChange={handleWorkFormatChange}
      >
        {workFormats.map(wf => (
          <option key={wf.id} value={wf.id}>
            {wf.work_format_name}
          </option>
        ))}
      </select>

                <label>Work Location</label>
                <select name="location" value={jobData.location} onChange={handleChange}>
                  <option value="">Select location</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Rai">Chiang Rai</option>
                </select>

                <label>Salary (Baht)</label>
                <input type="number" name="salary" value={jobData.salary} onChange={handleChange} placeholder="Salary" />

                <label>Responsibilities</label>
                <textarea name="responsibilities" value={jobData.responsibilities} onChange={handleChange} placeholder="Responsibilities" />
              </div>

              <div className="addjob-section right">
                <label>Features</label>

                <label>Application Deadline</label>
                <input type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />

                <label>Gender</label>
                <select
        id="gender"
        value={selectedGender}
        onChange={handleGenderChange}
      >
        {genders.map(g => (
          <option key={g.id} value={g.id}>
            {g.gender_name}
          </option>
        ))}
      </select>

                <label>Age Range</label>
                <input type="text" name="age_range" value={jobData.age_range} onChange={handleChange} placeholder="Age range" />

                <label>Education Level</label>
                <select
        id="educationLevel"
        value={selectedEducationLevel}
        onChange={handleEducationLevelChange}
      >
        {educationLevels.map(el => (
          <option key={el.id} value={el.id}>
            {el.education_level_name}
          </option>
        ))}
      </select>
              </div>
            </div>

            <div className="addjob-buttons">
              <button type="submit" className="addjob-save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditJob;
