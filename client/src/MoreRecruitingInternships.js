import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./MoreRecruitingInternships.css";

function MoreRecruitingInternships() {
  const getGenderLabel = (id) => {
    switch (id) {
      case 1:
        return 'Male';
      case 2:
        return 'Female';
      case 3:
        return 'Any';
      default:
        return 'Not specified';
    }
  };
  const getEd = (id) => {
    switch (id) {
      case 1:
        return 'High-school';
      case 2:
        return 'Bachelor';
      case 3:
        return 'Master';
      default:
        return 'Not specified';
    }
  };

  
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};

  const handleLogout = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleApply = () => {
    navigate("/applyrecruitinginternships", { state: { job } });
  };

  if (!job) {
    return <div>No job details available.</div>;
  }

  return (
    <div className="MoreRecruitingInternships-container">
      <aside className="MoreRecruitingInternships-sidebar">
        <div className="MoreRecruitingInternships-logo"></div>
        <h2 className="MoreRecruitingInternships-sidebar-title">User</h2>
        <ul className="MoreRecruitingInternships-sidebar-menu">
          <h4 className="MoreRecruitingInternships-sidebar-subheader">Recruitment</h4>
          <li>
            <Link
              to="/recruitingemployees"
              className={`MoreRecruitingInternships-sidebar-link ${
                location.pathname === "/recruitingemployees" ||
                location.pathname === "/morerecruitingemployees" ||
                location.pathname === "/applyrecruitingemployees"
                  ? "active"
                  : ""
              }`}
            >
              Recruiting employees
            </Link>
          </li>
          <li>
            <Link
              to="/recruitinginternships"
              className={`MoreRecruitingInternships-sidebar-link ${
                location.pathname === "/recruitinginternships" ||
                location.pathname === "/morerecruitinginternships" ||
                location.pathname === "/applyrecruitinginternships"
                  ? "active"
                  : ""
              }`}
            >
              Recruiting internships
            </Link>
          </li>
          <h4 className="MoreRecruitingInternships-sidebar-subheader">Status</h4>
          <li>
            <Link
              to="/applicantstatus"
              className={`MoreRecruitingInternships-sidebar-link ${
                location.pathname === "/applicantstatus" ? "active" : ""
              }`}
            >
              Applicant status
            </Link>
          </li>
          <h4 className="MoreRecruitingInternships-sidebar-subheader">Information</h4>
          <li>
            <Link
              to="/profile"
              className={`MoreRecruitingInternships-sidebar-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}
            >
              Profile
            </Link>
          </li>
        </ul>
        <div className="MoreRecruitingInternships-logout-container">
          <button className="MoreRecruitingInternships-logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="MoreRecruitingInternships-main-content">
        <header className="MoreRecruitingInternships-header">
          <h1 className="MoreRecruitingInternships-header-title">Recruiting Internships</h1>
        </header>

        <div className="MoreRecruitingInternships-job-details">
          <div className="MoreRecruitingInternships-job-header">
            <div className="MoreRecruitingInternships-job-title-container">
              <h2 className="MoreRecruitingInternships-job-title">{job.title}</h2>
              <p className="MoreRecruitingInternships-job-deadline">
                Applications accepted until:  {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button className="MoreRecruitingInternships-apply-button" onClick={handleApply}>
              Apply for Work
            </button>
          </div>

          <div className="MoreRecruitingInternships-job-description">
            <h3>Job Description:</h3>
            <ul>
              <li>Number accepted position: {job.num_accepted}</li>
              <li>Work location: {job.location}</li>
              <li>Salary: {job.salary}</li>
              <li>
                Responsibilities:
                <ul>
                  <li>Able to code in any languages, such as Java, JavaScript, Python etc.</li>
                  <li>Experience in automating testing on mobile apps, Android apps.</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="MoreRecruitingInternships-job-feature">
            <h3>Features:</h3>
            <ul>
            <li>Gender: {getGenderLabel(job.genders_id)}</li>

              <li>Age: {job.age_range}</li>
              <li>Education level: {getEd(job.education_levels_id)}</li>
            </ul>
          </div>

          <div className="MoreRecruitingInternships-job-additional">
            <h3>Additional Features:</h3>
            <ul>
              <li>Basic knowledge in IT, Computer Science or other related fields</li>
              <li>Outstanding drive and communication skills</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoreRecruitingInternships;