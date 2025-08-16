import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import React from 'react';
import AddAnnouncement from './AddAnnouncement';
import Addjob from './addjob';
import PersonnelInformation from './personnelinformation';
import CheckList from './checklist';
import Jobs from './jobs';
import ListJobs from './ListJobs';
import ExaminationResults from './examinationresults';
import AddPersonnel from './addpersonnel';
import Morepersonnal from './morepersonnal';
import MoreAnnouncement from './MoreAnnouncement';
import SubmitExam from './SubmitExam';
import EditJob from './editjob';
import MoreJobs from './MoreJobs'; 
import MorePersonnel from './morepersonnal';
import EditPersonnel from './EditPersonnel'
import AddDocumentApplicantStatus from './AddDocumentApplicantStatus';
import ApplicantStatus from './ApplicantStatus';
import ApplyRecruitingEmployees from './ApplyRecruitingEmployees';
import ApplyRecruitingInternships from './ApplyRecruitingInternships';
import EditProfile from './EditProfile';
import MoreRecruitingEmployees from './MoreRecruitingEmployees';
import MoreRecruitingInternships from './MoreRecruitingInternships';
import ScoreApplicantStatus from './ScoreApplicantStatus';
import RecruitingEmployees from './RecruitingEmployees';
import RecruitingInternships from './RecruitingInternships';  
import Profile from './Profile';
import ApplicantStatuss from './ApplicantStatuss';
import EmployeeProfile from './employeeProfile';
import EditEmployeeProfile from './EditEmployeeProfile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/addAnnouncement' element={<AddAnnouncement />} />
        <Route path='/addjob' element={<Addjob />} />
        <Route path='/personnelinformation' element={<PersonnelInformation />} />
        <Route path='/checklist' element={<CheckList />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/listjobs' element={<ListJobs />} />
        <Route path='/examinationresults' element={<ExaminationResults />} />
        <Route path='/editjob/:jobId' element={<EditJob />} />
        <Route path='/addpersonnel' element={<AddPersonnel />} />
        <Route path='/morepersonnal' element={<Morepersonnal />} />
        <Route path='/moreannouncement/:jobId' element={<MoreAnnouncement />} />
        <Route path='/submitexam' element={<SubmitExam />} />
        <Route path='/morejobs/:applicantId' element={<MoreJobs />} /> 
        <Route path="/morepersonnel/:id" element={<MorePersonnel />} />
        <Route path="/editpersonnel/:id" element={<EditPersonnel />} />
        <Route path='/adddocumentapplicantstatus' element={<AddDocumentApplicantStatus />} />
        <Route path='/applicantStatus' element={<ApplicantStatus />} />
        <Route path='/recruitingemployees' element={<RecruitingEmployees />} />
        <Route path='/recruitingInternships' element={<RecruitingInternships />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/moreRecruitingEmployees' element={<MoreRecruitingEmployees />} />
        <Route path='/moreRecruitingInternships' element={<MoreRecruitingInternships />} />
        <Route path='/recruitinginternships' element={<RecruitingInternships />} />
        <Route path='/scoreapplicantstatus' element={<ScoreApplicantStatus />} />
        <Route path='/applyrecruitingemployees' element={<ApplyRecruitingEmployees />} />
        <Route path='/applyrecruitinginternships' element={<ApplyRecruitingInternships />} />
        <Route path='/editprofile' element={<EditProfile />} />
        <Route path='/applicantstatuss' element={<ApplicantStatuss />} />
        <Route path='/morejobs/:user_id/:job_id' element={<MoreJobs />} />
        <Route path='/employeeProfile' element={<EmployeeProfile />} />
        <Route path='/EditEmployeeProfile' element={<EditEmployeeProfile />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;