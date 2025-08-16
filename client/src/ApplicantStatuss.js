import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ApplicantStatus.css";

function ApplicantStatus() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        alert("กรุณาเข้าสู่ระบบเพื่อดูเอกสาร");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3307/documents/${user_id}`);
        const data = await response.json();
        console.log("ข้อมูลเอกสารที่ได้รับ:", data); // Debug: ดูข้อมูลที่ได้จาก backend
        if (response.ok) {
          setDocuments(data);
        } else {
          alert(data.error || "ไม่สามารถดึงข้อมูลเอกสารได้");
        }
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงเอกสาร:", error);
        alert("เกิดข้อผิดพลาดขณะดึงข้อมูลเอกสาร");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="ApplicantStatus-container">
      <aside className="ApplicantStatus-sidebar">
        <div className="ApplicantStatus-logo"></div>
        <h2 className="ApplicantStatus-sidebar-title">ผู้ใช้</h2>
        <ul className="ApplicantStatus-sidebar-menu">
          <h4 className="ApplicantStatus-sidebar-subheader">การรับสมัคร</h4>
          <li>
            <Link to="/recruitingemployees" className="ApplicantStatus-sidebar-link">
              รับสมัครพนักงาน
            </Link>
          </li>
          <li>
            <Link to="/recruitinginternships" className="ApplicantStatus-sidebar-link">
              รับสมัครนักศึกษาฝึกงาน
            </Link>
          </li>
          <h4 className="ApplicantStatus-sidebar-subheader">สถานะ</h4>
          <li>
            <Link to="/applicantstatus" className="ApplicantStatus-sidebar-link active">
              สถานะผู้สมัคร
            </Link>
          </li>
          <h4 className="ApplicantStatus-sidebar-subheader">ข้อมูล</h4>
          <li>
            <Link to="/profile" className="ApplicantStatus-sidebar-link">
              โปรไฟล์
            </Link>
          </li>
        </ul>
        <div className="ApplicantStatus-logout-container">
          <button className="ApplicantStatus-logout-button" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <div className="ApplicantStatus-main-content">
        <header className="ApplicantStatus-header">
          <h1 className="ApplicantStatus-header-title">สถานะเอกสารของคุณ</h1>
        </header>

        <div className="ApplicantStatus-content">
          {documents ? (
            <div>
              <h2>เอกสารที่อัปโหลด</h2>
              <ul>
                <li>
                  เรซูเม่: {documents.resume_url ? (
                    <a href={documents.resume_url} target="_blank" rel="noopener noreferrer">ดูไฟล์</a>
                  ) : "ไม่มี URL"}
                </li>
                <li>
                  พอร์ตโฟลิโอ: {documents.portfolio_url ? (
                    <a href={documents.portfolio_url} target="_blank" rel="noopener noreferrer">ดูไฟล์</a>
                  ) : "ไม่มี URL"}
                </li>
                {documents.certificates_url && (
                  <li>
                    ใบรับรองการศึกษา: <a href={documents.certificates_url} target="_blank" rel="noopener noreferrer">ดูไฟล์</a>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p>ยังไม่มีเอกสารที่อัปโหลด</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicantStatus;