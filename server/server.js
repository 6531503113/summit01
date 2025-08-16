const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "231046",
  database: "summit",
});

// Unified multer storage for all file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "resume":
        cb(null, "uploads/resumes/");
        break;
      case "portfolio":
        cb(null, "uploads/portfolios/");
        break;
      case "educationalCertificates":
        cb(null, "uploads/certificates/");
        break;
      case "nationalId":
        cb(null, "uploads/national_ids/");
        break;
      case "household":
        cb(null, "uploads/households/");
        break;
      case "bankBook":
        cb(null, "uploads/bank_books/");
        break;
      default:
        cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Create all upload directories
const uploadFolders = [
  "uploads/resumes",
  "uploads/portfolios",
  "uploads/certificates",
  "uploads/national_ids",
  "uploads/households",
  "uploads/bank_books",
];
uploadFolders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Signup
app.post("/signup", (req, res) => {
  const { email, password, phone, firstname, lastname, national_id } = req.body;

  if (!email || !password || !phone || !firstname || !lastname || !national_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    db.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: "Database connection error" });

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return res.status(500).json({ error: "Transaction start error" });
        }

        const sqlLogin = "INSERT INTO login (email, password, phone, firstname, lastname, national_id) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(sqlLogin, [email, hash, phone, firstname, lastname, national_id], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ error: "Error inserting into login table" });
            });
          }

          const userId = result.insertId;
          const sqlUserProfile = "INSERT INTO userprofile (user_id, firstName, lastName, national_id, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)";
          connection.query(sqlUserProfile, [userId, firstname, lastname, national_id, phone, email], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: "Error inserting into userprofile table" });
              });
            }

            const sqlPersonnel = "INSERT INTO personnelaa (id, name, national_id, phone_number, email, position) VALUES (?, ?, ?, ?, ?, ?)";
            connection.query(sqlPersonnel, [userId, `${firstname} ${lastname}`, national_id, phone, email, "New Employee"], (err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ error: "Error inserting into personnelaa table" });
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ error: "Transaction commit error" });
                  });
                }
                connection.release();
                res.status(201).json({ message: "Signup successful!", user_id: userId });
              });
            });
          });
        });
      });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const query = `
    SELECT login.id, login.password, personnelaa.rights, personnelaa.id as personnel_id
    FROM login 
    JOIN personnelaa ON login.email = personnelaa.email 
    WHERE login.email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid password" });

    res.json({
      message: "Login successful",
      rights: user.rights,
      user_id: user.personnel_id,
    });
  });
});

// Job Management
app.post("/jobs", (req, res) => {
  const { title, description, num_accepted, work_formats_id, location, salary, responsibilities, deadline, genders_id, age_range, education_levels_id } = req.body;
  if (!title || !description || !num_accepted) return res.status(400).json({ error: "Title, description, and num_accepted are required" });

  const sql = "INSERT INTO jobs (title, description, num_accepted, work_formats_id, location, salary, responsibilities, deadline, genders_id, age_range, education_levels_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, description, num_accepted, work_formats_id, location, salary, responsibilities, deadline, genders_id, age_range, education_levels_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "Job added successfully!", jobId: result.insertId });
  });
});

app.get("/jobs", (req, res) => {
  const sql = `
    SELECT j.*, g.gender_name, wf.work_format_name, el.education_level_name
    FROM jobs j 
    LEFT JOIN genders g ON j.genders_id = g.id 
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id 
    LEFT JOIN education_levels el ON j.education_levels_id = el.id
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
});

app.get("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT j.id, j.title, j.description, j.num_accepted, j.location, j.salary, j.responsibilities, j.deadline, j.age_range,
           g.gender_name, wf.work_format_name, el.education_level_name
    FROM jobs j
    LEFT JOIN genders g ON j.genders_id = g.id 
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id 
    LEFT JOIN education_levels el ON j.education_levels_id = el.id
    WHERE j.id = ?
  `;
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "Job not found" });

    // Convert deadline to 'yyyy-MM-dd' format
    const jobData = data[0];
    const deadline = new Date(jobData.deadline);
    const formattedDeadline = deadline.toISOString().split('T')[0];  // 'yyyy-MM-dd'
    jobData.deadline = formattedDeadline;

    res.json(jobData);
  });
});



app.put("/update-job/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, num_accepted, location, salary, deadline, genders_id, age_range, education_levels_id, work_formats_id, responsibilities } = req.body;
  const sql = `
    UPDATE jobs 
    SET title = ?, description = ?, num_accepted = ?, location = ?, salary = ?, deadline = ?, genders_id = ?, age_range = ?, education_levels_id = ?, work_formats_id = ?, responsibilities = ?
    WHERE id = ?
  `;
  db.query(sql, [title, description, num_accepted, location, salary, deadline, genders_id, age_range, education_levels_id, work_formats_id, responsibilities, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job updated successfully!" });
  });
});

app.delete("/delete-job/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM jobs WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted successfully!" });
  });
});

// Lookup Tables
app.get("/education-levels", (req, res) => {
  db.query("SELECT * FROM education_levels", (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
});

app.get("/genders", (req, res) => {
  db.query("SELECT * FROM genders", (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
});

app.get("/work-formats", (req, res) => {
  db.query("SELECT * FROM work_formats", (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
});

// Personnel Management
app.post("/add-personnel", (req, res) => {
  const { name, nationalId, phoneNumber, email, dateOfBirth, address, position, rights, dateOfEmployment, employmentStatus, educationLevel, fieldOfStudy, institution, graduationYear, gpa } = req.body;
  if (!name || !nationalId || !phoneNumber || !email) return res.status(400).json({ error: "Required fields missing" });

  const sql = `
    INSERT INTO personnelaa (name, national_id, phone_number, email, date_of_birth, address, position, rights, date_of_employment, employment_status, education_level, field_of_study, institution, graduation_year, gpa) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, nationalId, phoneNumber, email, dateOfBirth, address, position, rights, dateOfEmployment, employmentStatus, educationLevel, fieldOfStudy, institution, graduationYear, gpa], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "Personnel added successfully!", id: result.insertId });
  });
});

app.get("/personnelaa", (req, res) => {
  const sql = "SELECT id, name, rights FROM personnelaa";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
});

app.get("/personnelaa/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, name, national_id, phone_number, email, date_of_birth, address, position, rights, date_of_employment, employment_status, education_level, field_of_study, institution, graduation_year, gpa
    FROM personnelaa 
    WHERE id = ?
  `;
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "Personnel not found" });
    res.json(data[0]);
  });
});

app.put("/personnelaa/:id", (req, res) => {
  const { id } = req.params;
  const { name, national_id, phone_number, email, date_of_birth, address, position, rights, date_of_employment, employment_status, education_level, field_of_study, institution, graduation_year, gpa } = req.body;
  const sql = `
    UPDATE personnelaa 
    SET name = ?, national_id = ?, phone_number = ?, email = ?, date_of_birth = ?, address = ?, position = ?, rights = ?, date_of_employment = ?, employment_status = ?, education_level = ?, field_of_study = ?, institution = ?, graduation_year = ?, gpa = ?
    WHERE id = ?
  `;
  db.query(sql, [name, national_id, phone_number, email, date_of_birth, address, position, rights, date_of_employment, employment_status, education_level, field_of_study, institution, graduation_year, gpa, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Personnel not found" });
    res.json({ message: "Personnel updated successfully!" });
  });
});

app.delete("/personnelaa/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM personnelaa WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Personnel not found" });
    res.json({ message: "Personnel deleted successfully!" });
  });
});


app.get("/userprofile/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM userprofile WHERE user_id = ?";
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "User profile not found" });
    res.json(data[0]);
  });
});

app.put("/userprofile/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { firstName, lastName, national_id, phone_number, birthday, nationality, ethnicity, religion, bloodType, email, houseNumber, moo, soi, road, subDistrict, district, province, postalCode, gradForm, gradYear, highSchool, gpa, educationLevel, degree, faculty, major, university, photo } = req.body;
  const sql = `
    UPDATE userprofile 
    SET firstName = ?, lastName = ?, national_id = ?, phone_number = ?, birthday = ?, nationality = ?, ethnicity = ?, religion = ?, bloodType = ?, email = ?, houseNumber = ?, moo = ?, soi = ?, road = ?, subDistrict = ?, district = ?, province = ?, postalCode = ?, gradForm = ?, gradYear = ?, highSchool = ?, gpa = ?, educationLevel = ?, degree = ?, faculty = ?, major = ?, university = ?, photo = ?
    WHERE user_id = ?
  `;
  db.query(sql, [firstName, lastName, national_id, phone_number, birthday, nationality, ethnicity, religion, bloodType, email, houseNumber, moo, soi, road, subDistrict, district, province, postalCode, gradForm, gradYear, highSchool, gpa, educationLevel, degree, faculty, major, university, photo, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User profile not found" });
    res.json({ message: "User profile updated successfully!" });
  });
});

// Job Application
app.post("/apply", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "portfolio", maxCount: 1 },
  { name: "educationalCertificates", maxCount: 1 },
]), (req, res) => {
  try {
    const { user_id, job_id } = req.body;
    const files = req.files;

    if (!user_id || !job_id) return res.status(400).json({ error: "user_id and job_id are required" });
    if (!files.resume || !files.portfolio) return res.status(400).json({ error: "Resume and portfolio are required" });

    const resume = files.resume[0];
    const portfolio = files.portfolio[0];
    const certificates = files.educationalCertificates ? files.educationalCertificates[0] : null;

    const sql = `
      INSERT INTO documents (user_id, job_id, resume_filename, resume_filepath, portfolio_filename, portfolio_filepath, educational_certificates_filename, educational_certificates_filepath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      user_id, job_id, resume.filename, resume.path, portfolio.filename, portfolio.path,
      certificates ? certificates.filename : null, certificates ? certificates.path : null,
    ], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(200).json({
        message: "Application submitted successfully!",
        documentId: result.insertId,
        files: {
          resume: `/uploads/resumes/${resume.filename}`,
          portfolio: `/uploads/portfolios/${portfolio.filename}`,
          certificates: certificates ? `/uploads/certificates/${certificates.filename}` : null,
        },
      });
    });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ error: "Error submitting application" });
  }
});

// Document Retrieval
app.get("/documents/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT id, job_id, resume_filename, resume_filepath, portfolio_filename, portfolio_filepath, educational_certificates_filename, educational_certificates_filepath
    FROM documents 
    WHERE user_id = ?
  `;
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "No documents found" });
    res.json(data.map(doc => ({
      ...doc,
      resume_url: doc.resume_filename ? `http://localhost:3307/uploads/resumes/${doc.resume_filename}` : null,
      portfolio_url: doc.portfolio_filename ? `http://localhost:3307/uploads/portfolios/${doc.portfolio_filename}` : null,
      certificates_url: doc.educational_certificates_filename ? `http://localhost:3307/uploads/certificates/${doc.educational_certificates_filename}` : null,
    })));
  });
});

app.get("/documentsna", (req, res) => {
  const { work_format, job_title } = req.query;
  let sql = `
    SELECT d.id, d.user_id, d.job_id, d.resume_filename, d.resume_filepath, d.portfolio_filename, d.portfolio_filepath, 
           d.educational_certificates_filename, d.educational_certificates_filepath,
           up.firstName, up.lastName, up.phone_number, up.birthday, up.email, up.educationLevel, up.faculty, up.major, up.gradYear, up.gpa,
           j.title AS job_title, wf.work_format_name,
           er.exam_score AS examScore, er.interview_score AS interviewScore, er.total_score AS totalScore, er.status
    FROM documents d
    LEFT JOIN userprofile up ON d.user_id = up.user_id
    LEFT JOIN jobs j ON d.job_id = j.id
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id
    LEFT JOIN examination_results er ON d.user_id = er.user_id AND d.job_id = er.job_id
  `;
  const conditions = [];
  const params = [];
  if (work_format) {
    conditions.push("wf.work_format_name = ?");
    params.push(work_format);
  }
  if (job_title) {
    conditions.push("j.title = ?");
    params.push(job_title);
  }
  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      job_id: doc.job_id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone_number: doc.phone_number,
      birthday: doc.birthday,
      email: doc.email,
      educationLevel: doc.educationLevel,
      faculty: doc.faculty,
      major: doc.major,
      gradYear: doc.gradYear,
      gpa: doc.gpa,
      job_title: doc.job_title,
      work_format_name: doc.work_format_name,
      examScore: doc.examScore || 0,
      interviewScore: doc.interviewScore || 0,
      totalScore: doc.totalScore || 0,
      status: doc.status || "Pending",
      resume_url: doc.resume_filename ? `http://localhost:3307/uploads/resumes/${doc.resume_filename}` : null,
      portfolio_url: doc.portfolio_filename ? `http://localhost:3307/uploads/portfolios/${doc.portfolio_filename}` : null,
      certificates_url: doc.educational_certificates_filename ? `http://localhost:3307/uploads/certificates/${doc.educational_certificates_filename}` : null,
    })));
  });
});

app.get("/documentsnal", (req, res) => {
  const { work_format, job_title } = req.query;
  let sql = `
    SELECT d.id, d.user_id, d.job_id, d.resume_filename, d.resume_filepath, d.portfolio_filename, d.portfolio_filepath, 
           d.educational_certificates_filename, d.educational_certificates_filepath,
           up.firstName, up.lastName, up.phone_number, up.birthday, up.email, up.educationLevel, up.faculty, up.major, up.gradYear, up.gpa,
           j.title AS job_title, wf.work_format_name,
           er.exam_score AS examScore, er.interview_score AS interviewScore, er.total_score AS totalScore, er.status
    FROM documents d
    LEFT JOIN userprofile up ON d.user_id = up.user_id
    LEFT JOIN jobs j ON d.job_id = j.id
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id
    LEFT JOIN examination_results er ON d.user_id = er.user_id AND d.job_id = er.job_id
    WHERE d.selected_for_exam = 1
  `;
  const conditions = [];
  const params = [];
  if (work_format) {
    conditions.push("wf.work_format_name = ?");
    params.push(work_format);
  }
  if (job_title) {
    conditions.push("j.title = ?");
    params.push(job_title);
  }
  if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      job_id: doc.job_id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone_number: doc.phone_number,
      birthday: doc.birthday,
      email: doc.email,
      educationLevel: doc.educationLevel,
      faculty: doc.faculty,
      major: doc.major,
      gradYear: doc.gradYear,
      gpa: doc.gpa,
      job_title: doc.job_title,
      work_format_name: doc.work_format_name,
      examScore: doc.examScore || 0,
      interviewScore: doc.interviewScore || 0,
      totalScore: doc.totalScore || 0,
      status: doc.status || "Pending",
      resume_url: doc.resume_filename ? `http://localhost:3307/uploads/resumes/${doc.resume_filename}` : null,
      portfolio_url: doc.portfolio_filename ? `http://localhost:3307/uploads/portfolios/${doc.portfolio_filename}` : null,
      certificates_url: doc.educational_certificates_filename ? `http://localhost:3307/uploads/certificates/${doc.educational_certificates_filename}` : null,
    })));
  });
});

app.get("/documentsna/:user_id/:job_id", (req, res) => {
  const { user_id, job_id } = req.params;
  const sql = `
    SELECT d.id, d.user_id, d.job_id, d.resume_filename, d.resume_filepath, d.portfolio_filename, d.portfolio_filepath, 
           d.educational_certificates_filename, d.educational_certificates_filepath,
           up.firstName, up.lastName, up.national_id, up.phone_number, up.birthday, up.nationality, up.email, up.educationLevel, up.faculty, up.major, up.gradYear, up.gpa, up.photo,
           j.title AS job_title, wf.work_format_name
    FROM documents d
    LEFT JOIN userprofile up ON d.user_id = up.user_id
    LEFT JOIN jobs j ON d.job_id = j.id
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id
    WHERE d.user_id = ? AND d.job_id = ?
  `;
  db.query(sql, [user_id, job_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "No documents found" });

    const doc = data[0];
    res.json({
      id: doc.id,
      user_id: doc.user_id,
      job_id: doc.job_id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      national_id: doc.national_id,
      phone_number: doc.phone_number,
      birthday: doc.birthday,
      nationality: doc.nationality,
      email: doc.email,
      educationLevel: doc.educationLevel,
      faculty: doc.faculty,
      major: doc.major,
      gradYear: doc.gradYear,
      gpa: doc.gpa,
      job_title: doc.job_title,
      work_format_name: doc.work_format_name,
      resume: { filename: doc.resume_filename, url: doc.resume_filename ? `http://localhost:3307/uploads/resumes/${doc.resume_filename}` : null },
      portfolio: { filename: doc.portfolio_filename, url: doc.portfolio_filename ? `http://localhost:3307/uploads/portfolios/${doc.portfolio_filename}` : null },
      certificates: { filename: doc.educational_certificates_filename, url: doc.educational_certificates_filename ? `http://localhost:3307/uploads/certificates/${doc.educational_certificates_filename}` : null },
      photo: doc.photo ? `http://localhost:3307/uploads/photos/${doc.photo}` : null,
    });
  });
});

app.get("/documentsnana/:job_id", (req, res) => {
  const { job_id } = req.params;
  const sql = `
    SELECT 
      d.id, d.user_id, d.job_id, d.resume_filename, d.resume_filepath, d.portfolio_filename, d.portfolio_filepath, 
      d.educational_certificates_filename, d.educational_certificates_filepath,
      up.firstName, up.lastName, up.national_id, up.phone_number, up.birthday, up.nationality, up.email, up.educationLevel, up.faculty, up.major, up.gradYear, up.gpa, up.photo,
      j.title AS job_title, COALESCE(wf.work_format_name, 'N/A') AS work_format_name,
      er.status, er.total_score
    FROM documents d
    LEFT JOIN userprofile up ON d.user_id = up.user_id
    LEFT JOIN jobs j ON d.job_id = j.id
    LEFT JOIN work_formats wf ON j.work_formats_id = wf.id
    LEFT JOIN examination_results er ON d.user_id = er.user_id AND d.job_id = er.job_id
    WHERE d.job_id = ?
  `;
  db.query(sql, [job_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "No applicants found" });
    const baseUrl = "http://localhost:3307";
    res.json(data.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      job_id: doc.job_id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      national_id: doc.national_id,
      phone_number: doc.phone_number,
      birthday: doc.birthday,
      nationality: doc.nationality,
      email: doc.email,
      educationLevel: doc.educationLevel,
      faculty: doc.faculty,
      major: doc.major,
      gradYear: doc.gradYear,
      gpa: doc.gpa,
      job_title: doc.job_title,
      work_format_name: doc.work_format_name,
      status: doc.status || "Fail", // Default to "Fail" if null
      totalScore: doc.total_score || 0,
      resume: { filename: doc.resume_filename, url: doc.resume_filename ? `${baseUrl}/uploads/resumes/${doc.resume_filename}` : null },
      portfolio: { filename: doc.portfolio_filename, url: doc.portfolio_filename ? `${baseUrl}/uploads/portfolios/${doc.portfolio_filename}` : null },
      certificates: { filename: doc.educational_certificates_filename, url: doc.educational_certificates_filename ? `${baseUrl}/uploads/certificates/${doc.educational_certificates_filename}` : null },
      photo: doc.photo ? `${baseUrl}/uploads/photos/${doc.photo}` : null,
    })));
  });
});

// Applicant Status
app.get("/applicant-status", (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: "user_id is required" });

  const sql = `
    SELECT er.user_id, er.job_id, er.exam_date, er.interview_date, er.interview_time, er.exam_score, er.interview_score, er.total_score, er.status, j.title AS job_title
    FROM examination_results er
    LEFT JOIN jobs j ON er.job_id = j.id
    WHERE er.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});

// Exam Scheduling and Results
app.post("/exam-schedule", (req, res) => {
  const applicants = req.body;
  if (!Array.isArray(applicants) || applicants.length === 0) return res.status(400).json({ error: "No applicants provided" });

  const values = applicants.map(applicant => [
    applicant.user_id, applicant.job_id, applicant.examDate || null, applicant.interviewDate || null, applicant.interviewTime || null,
  ]);
  const sql = `
    INSERT INTO examination_results (user_id, job_id, exam_date, interview_date, interview_time)
    VALUES ?
    ON DUPLICATE KEY UPDATE exam_date = VALUES(exam_date), interview_date = VALUES(interview_date), interview_time = VALUES(interview_time)
  `;
  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json({ message: "Exam schedule saved successfully", affectedRows: result.affectedRows });
  });
});

app.post("/examination-results", (req, res) => {
  const results = req.body;
  const sql = `
    INSERT INTO examination_results (user_id, job_id, exam_score, interview_score, total_score, status)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      exam_score = VALUES(exam_score),
      interview_score = VALUES(interview_score),
      total_score = VALUES(total_score),
      status = VALUES(status)
  `;
  const values = results.map(r => [r.user_id, r.job_id, r.examScore, r.interviewScore, r.totalScore, r.status]);
  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Results saved", affectedRows: result.affectedRows });
  });
});

// Additional Documents
app.post("/additional-documents", upload.fields([
  { name: "nationalId", maxCount: 1 },
  { name: "household", maxCount: 1 },
  { name: "bankBook", maxCount: 1 },
]), (req, res) => {
  try {
    const { user_id, job_id } = req.body;
    const files = req.files;

    if (!user_id || !job_id) return res.status(400).json({ error: "user_id and job_id are required" });

    const nationalId = files.nationalId ? files.nationalId[0] : null;
    const household = files.household ? files.household[0] : null;
    const bankBook = files.bankBook ? files.bankBook[0] : null;

    const sql = `
      UPDATE documents
      SET national_id_filename = ?, national_id_filepath = ?, household_filename = ?, household_filepath = ?, bank_book_filename = ?, bank_book_filepath = ?
      WHERE user_id = ? AND job_id = ?
    `;
    db.query(sql, [
      nationalId ? nationalId.filename : null, nationalId ? nationalId.path : null,
      household ? household.filename : null, household ? household.path : null,
      bankBook ? bankBook.filename : null, bankBook ? bankBook.path : null,
      user_id, job_id,
    ], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "No existing application found" });
      res.status(200).json({
        message: "Additional documents uploaded successfully",
        files: {
          nationalId: nationalId ? `/uploads/national_ids/${nationalId.filename}` : null,
          household: household ? `/uploads/households/${household.filename}` : null,
          bankBook: bankBook ? `/uploads/bank_books/${bankBook.filename}` : null,
        },
      });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Error uploading additional documents" });
  }
});

app.get("/additional-documents/:user_id/:job_id", (req, res) => {
  const { user_id, job_id } = req.params;
  const sql = `
    SELECT national_id_filename, national_id_filepath, household_filename, household_filepath, bank_book_filename, bank_book_filepath
    FROM documents
    WHERE user_id = ? AND job_id = ?
  `;
  db.query(sql, [user_id, job_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "No additional documents found" });

    const doc = data[0];
    res.json({
      national_id: doc.national_id_filename ? { filename: doc.national_id_filename, url: `http://localhost:3307/uploads/national_ids/${doc.national_id_filename}` } : null,
      household: doc.household_filename ? { filename: doc.household_filename, url: `http://localhost:3307/uploads/households/${doc.household_filename}` } : null,
      bank_book: doc.bank_book_filename ? { filename: doc.bank_book_filename, url: `http://localhost:3307/uploads/bank_books/${doc.bank_book_filename}` } : null,
    });
  });
});


app.get("/api/qualified-applicants", (req, res) => {
  const sql = `
    SELECT er.user_id, er.job_id ,er.status ,CONCAT(up.firstName, ' ', up.lastName) AS name
    FROM examination_results er
    LEFT JOIN userprofile up ON er.user_id = up.user_id
    WHERE er.status = 'Pass'
  `;
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data.map(row => ({
      user_id: row.user_id,
      job_id: row.job_id,
      name: row.name,
      status: row.status
    })));
  });
});


// Get qualified applicants with checklist data
app.get("/api/checklist", (req, res) => {
  const sql = `
    SELECT 
      up.user_id,
      CONCAT(up.firstName, ' ', up.lastName) AS name,
      up.employee_card,
      up.email_setup,
      up.vpn_setup,
      up.notebook_issued
    FROM userprofile up
    JOIN examination_results er ON up.user_id = er.user_id
    WHERE er.status = 'Pass' OR er.total_score >= 150
  `;
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching checklist:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data);
  });
});

// Save checklist updates
app.post("/api/checklist", (req, res) => {
  const checklistData = req.body; // Expecting { user_id: { employee_card, email_setup, vpn_setup, notebook_issued } }

  if (!checklistData || Object.keys(checklistData).length === 0) {
    return res.status(400).json({ error: "Checklist data is required" });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ error: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction start error" });
      }

      const queries = Object.entries(checklistData).map(([user_id, fields]) => {
        return new Promise((resolve, reject) => {
          const sql = `
            UPDATE userprofile
            SET 
              employee_card = ?,
              email_setup = ?,
              vpn_setup = ?,
              notebook_issued = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
          `;
          connection.query(sql, [
            fields.employee_card,
            fields.email_setup,
            fields.vpn_setup,
            fields.notebook_issued,
            user_id
          ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      });

      Promise.all(queries)
        .then(() => {
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: "Transaction commit error" });
              });
            }
            connection.release();
            res.json({ message: "Checklist saved successfully" });
          });
        })
        .catch((err) => {
          console.error("Error saving checklist:", err);
          connection.rollback(() => {
            connection.release();
            res.status(500).json({ error: "Database error" });
          });
        });
    });
  });
});

app.put("/api/update-selection", async (req, res) => {
  const { user_id, job_id, selected } = req.body;
  try {
    await db.query(
      "UPDATE documents SET selected_for_exam = ? WHERE user_id = ? AND job_id = ?",
      [selected ? 1 : 0, user_id, job_id]
    );
    res.json({ message: "อัปเดตสถานะเรียบร้อย" });
  } catch (error) {
    console.error("อัปเดตล้มเหลว:", error);
    res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลได้" });
  }
});

app.get("/api/exam-applicants/:job_id", (req, res) => {
  const { job_id } = req.params;

  const sql = `
SELECT d.id, d.user_id, d.job_id, d.resume_filename, d.resume_filepath,
       up.firstName, up.lastName, up.phone_number, up.email, up.educationLevel, up.major, up.gpa,
       j.title AS job_title, wf.work_format_name,
       er.exam_score AS examScore, er.interview_score AS interviewScore, er.total_score AS totalScore, er.status
FROM documents d
INNER JOIN userprofile up ON d.user_id = up.user_id
LEFT JOIN jobs j ON d.job_id = j.id
LEFT JOIN work_formats wf ON j.work_formats_id = wf.id
LEFT JOIN examination_results er ON d.user_id = er.user_id AND d.job_id = er.job_id
INNER JOIN documents c ON d.user_id = c.user_id AND d.job_id = c.job_id
WHERE d.job_id = ?;

  `;

  db.query(sql, [job_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(data.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      job_id: doc.job_id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone_number: doc.phone_number,
      email: doc.email,
      educationLevel: doc.educationLevel,
      major: doc.major,
      gpa: doc.gpa,
      job_title: doc.job_title,
      work_format_name: doc.work_format_name,
      examScore: doc.examScore || 0,
      interviewScore: doc.interviewScore || 0,
      totalScore: doc.totalScore || 0,
      status: doc.status || "Pending",
      resume_url: doc.resume_filename ? `http://localhost:3307/uploads/resumes/${doc.resume_filename}` : null,
      portfolio_url: doc.portfolio_filename ? `http://localhost:3307/uploads/portfolios/${doc.portfolio_filename}` : null,
      certificates_url: doc.educational_certificates_filename ? `http://localhost:3307/uploads/certificates/${doc.educational_certificates_filename}` : null,
    })));
  });
});

// Add these endpoints to your existing Express server

// Get employee profile by id
app.get("/api/employee/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      p.id, 
      p.name, 
      p.national_id, 
      p.phone_number, 
      p.email, 
      p.date_of_birth as birthDate, 
      p.nationality, 
      p.ethnicity, 
      p.religion, 
      p.address, 
      p.position as jobPosition, 
      p.rights, 
      p.date_of_employment as startDate, 
      p.employment_status, 
      p.education_level, 
      p.field_of_study, 
      p.institution, 
      p.graduation_year, 
      p.gpa
    FROM personnelaa p
    WHERE p.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching employee profile:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Employee profile not found" });
    }

    // Process the address field to split it into components
    const employee = results[0];
    let address = {
      houseNumber: "",
      street: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: ""
    };

    if (employee.address && employee.address !== 'Not specified') {
      try {
        // Try to parse if the address is stored as JSON
        const parsedAddress = JSON.parse(employee.address);
        address = { ...address, ...parsedAddress };
      } catch (e) {
        // If not JSON, try to parse the address as a string
        const addressParts = employee.address.split(',').map(part => part.trim());
        if (addressParts.length >= 1) address.houseNumber = addressParts[0];
        if (addressParts.length >= 2) address.street = addressParts[1];
        if (addressParts.length >= 3) address.subdistrict = addressParts[2];
        if (addressParts.length >= 4) address.district = addressParts[3];
        if (addressParts.length >= 5) address.province = addressParts[4];
        if (addressParts.length >= 6) address.postalCode = addressParts[5];
      }
    }

    // Create the response object in the expected format
    const profileData = {
      personalInfo: {
        name: employee.name,
        employeeCode: employee.id.toString(),
        idCard: employee.national_id,
        phoneNumber: employee.phone_number,
        birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : "",
        nationality: employee.nationality || "",
        ethnicity: employee.ethnicity || "",
        religion: employee.religion || "",
        bloodType: "", // Not in personnelaa table
        jobPosition: employee.jobPosition || "",
        startDate: employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : "",
      },
      address: address,
      educationalHistory: {
        highSchool: {
          schoolName: "",
          graduationDate: "",
          gpa: "",
        },
        university: {
          faculty: employee.field_of_study || "",
          degree: employee.education_level || "",
          major: employee.field_of_study || "",
          graduationDate: employee.graduation_year ? employee.graduation_year.toString() : "",
        },
      },
    };

    res.json(profileData);
  });
});

// Get employee profile by user_id (from userprofile table)
app.get("/api/employee-profile/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT * FROM userprofile WHERE user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const user = results[0];
    
    // Format data to match the expected structure in the frontend
    const profileData = {
      personalInfo: {
        name: `${user.firstName} ${user.lastName}`,
        employeeCode: user.user_id.toString(),
        idCard: user.national_id,
        phoneNumber: user.phone_number,
        birthDate: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "",
        nationality: user.nationality || "",
        ethnicity: user.ethnicity || "",
        religion: user.religion || "",
        bloodType: user.bloodType || "",
        jobPosition: "", // Not in userprofile table
        startDate: "", // Not in userprofile table
      },
      address: {
        houseNumber: user.houseNumber || "",
        street: user.road || "",
        subdistrict: user.subDistrict || "",
        district: user.district || "",
        province: user.province || "",
        postalCode: user.postalCode || "",
      },
      educationalHistory: {
        highSchool: {
          schoolName: user.highSchool || "",
          graduationDate: user.gradYear ? user.gradYear.toString() : "",
          gpa: user.gpa ? user.gpa.toString() : "",
        },
        university: {
          faculty: user.faculty || "",
          degree: user.degree || "",
          major: user.major || "",
          graduationDate: user.gradYear ? user.gradYear.toString() : "",
        },
      },
      photo: user.photo || null
    };

    res.json(profileData);
  });
});

// Update employee profile (personnelaa table)
app.put("/api/employee/:id", (req, res) => {
  const { id } = req.params;
  const profile = req.body;
  
  // Extract values from the profile object
  const personalInfo = profile.personalInfo || {};
  const addressInfo = profile.address || {};
  const educationInfo = profile.educationalHistory || {};
  
  // Format the address as a string for storing in the personnelaa table
  const addressString = [
    addressInfo.houseNumber || "",
    addressInfo.street || "",
    addressInfo.subdistrict || "",
    addressInfo.district || "",
    addressInfo.province || "",
    addressInfo.postalCode || ""
  ].filter(Boolean).join(", ");

  // Build SQL and parameters for the update
  const sql = `
    UPDATE personnelaa
    SET 
      name = ?,
      national_id = ?,
      phone_number = ?,
      date_of_birth = ?,
      nationality = ?,
      ethnicity = ?,
      religion = ?,
      address = ?,
      position = ?,
      date_of_employment = ?,
      education_level = ?,
      field_of_study = ?,
      graduation_year = ?
    WHERE id = ?
  `;

  const params = [
    personalInfo.name,
    personalInfo.idCard,
    personalInfo.phoneNumber,
    personalInfo.birthDate,
    personalInfo.nationality,
    personalInfo.ethnicity,
    personalInfo.religion,
    addressString,
    personalInfo.jobPosition,
    personalInfo.startDate,
    educationInfo.university?.degree || "",
    educationInfo.university?.major || "",
    educationInfo.university?.graduationDate || null,
    id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating employee profile:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee profile not found" });
    }
    
    res.json({ message: "Employee profile updated successfully" });
  });
});

// Update user profile (userprofile table)
app.put("/api/employee-profile/:user_id", (req, res) => {
  const { user_id } = req.params;
  const profile = req.body;
  const photo = req.body.photo || null;
  
  // Extract values from the profile object
  const personalInfo = profile.personalInfo || {};
  const addressInfo = profile.address || {};
  const educationInfo = profile.educationalHistory || {};
  
  // Extract first and last name from full name
  let firstName = "";
  let lastName = "";
  if (personalInfo.name) {
    const nameParts = personalInfo.name.split(' ');
    firstName = nameParts[0] || "";
    lastName = nameParts.slice(1).join(' ') || "";
  }

  // Build SQL and parameters for the update
  const sql = `
    UPDATE userprofile
    SET 
      firstName = ?,
      lastName = ?,
      national_id = ?,
      phone_number = ?,
      birthday = ?,
      nationality = ?,
      ethnicity = ?,
      religion = ?,
      bloodType = ?,
      houseNumber = ?,
      road = ?,
      subDistrict = ?,
      district = ?,
      province = ?,
      postalCode = ?,
      highSchool = ?,
      gradYear = ?,
      gpa = ?,
      degree = ?,
      faculty = ?,
      major = ?,
      photo = ?
    WHERE user_id = ?
  `;

  const params = [
    firstName,
    lastName,
    personalInfo.idCard,
    personalInfo.phoneNumber,
    personalInfo.birthDate,
    personalInfo.nationality,
    personalInfo.ethnicity,
    personalInfo.religion,
    personalInfo.bloodType,
    addressInfo.houseNumber,
    addressInfo.street,
    addressInfo.subdistrict,
    addressInfo.district,
    addressInfo.province,
    addressInfo.postalCode,
    educationInfo.highSchool?.schoolName || "",
    educationInfo.university?.graduationDate || educationInfo.highSchool?.graduationDate || null,
    educationInfo.highSchool?.gpa || null,
    educationInfo.university?.degree || "",
    educationInfo.university?.faculty || "",
    educationInfo.university?.major || "",
    photo,
    user_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating user profile:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }
    
    res.json({ message: "User profile updated successfully" });
  });
});

// Upload employee profile photo
app.post("/api/employee/upload-photo", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  const { user_id } = req.body;
  
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  
  // Create directory for photos if it doesn't exist
  const photoDir = "uploads/photos";
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
  }
  
  // Generate new filename
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileExtension = path.extname(req.file.originalname);
  const newFilename = `photo-${uniqueSuffix}${fileExtension}`;
  const newFilePath = path.join(photoDir, newFilename);
  
  // Move the uploaded file to the photos directory
  fs.renameSync(req.file.path, newFilePath);
  
  // Update the user profile with the new photo filename
  const sql = "UPDATE userprofile SET photo = ? WHERE user_id = ?";
  db.query(sql, [newFilename, user_id], (err, result) => {
    if (err) {
      console.error("Error updating profile photo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (result.affectedRows === 0) {ห
      return res.status(404).json({ error: "User profile not found" });
    }
    
    res.json({ 
      message: "Profile photo uploaded successfully",
      photo: `http://localhost:3307/uploads/photos/${newFilename}`
    });
  });
});

app.listen(3307, () => {
  console.log("รันละสัส");
});