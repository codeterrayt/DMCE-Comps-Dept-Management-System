import { createContext, useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from './components/Home';
import SideNav from './components/SideNav';
import Start from './components/Start';
import Internship from './components/Internship';
import Achivements from './components/Achivements';
import ExtraCurr from './components/ExtraCurr';
import Hackathon from './components/Hackathon';
import HigherStudies from './components/HigherStudies';
import SignUpForm from './components/SignUp';
import LoginForm from './components/Login';
import AddInternship from './components/AddInternship';
import AddAchievements from './components/AddAchievements';
import AddExtraCurr from './components/AddExtraCurr';
import AddHackathons from './components/AddHackathons';
import AddHigherStudies from './components/AddHigherStudies';
import AddPlacementDetails from './components/AddPlacement';
import Placement from './components/Placement';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import HomeAdmin from './components/Admin/HomeAdmin';
import InternshipAdmin from './components/Admin/Internship.Admin';
import ExtraCurrAdmin from './components/Admin/ExtraCurr.Admin';
import AchievementAdmin from './components/Admin/Achievement.Admin';
import HackathonAdmin from './components/Admin/Hackathon.Admin';
import HigherStudiesAdmin from './components/Admin/HigherStudies.Admin';
import PlacementAdmin from './components/Admin/Placement.Admin';
import EditProfileAdmin from './components/Admin/EditProfile.Admin';
import AddProfessor from './components/Admin/AddProfessor';
import AddSubject from './components/Admin/AddSubject';
import AddBatch from './components/Admin/AddBatch';
import ProfessorHome from './components/Professor/ProfessorHome';
import AssignSubject from './components/Admin/AssignSubject';
import AddStudent from './components/Admin/AddStudent';
import PageNotFound from './components/PageNotFound';
import AddAttendance from './components/Professor/AddAttendance';

export const userContext = createContext()



function App() {

  const [user, setUser] = useState()


  return (
    <userContext.Provider value={{ user, setUser }}>

      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/dmce" element={<SideNav />}>
            <Route path="home" element={<Home />} />
            <Route path="internship" element={<Internship />} />
            <Route path="add/internship" element={<AddInternship />} />
            <Route path="add/internship/:id" element={<AddInternship />} />
            <Route path="achivement" element={<Achivements />} />
            <Route path="add/achivement" element={<AddAchievements />} />
            <Route path="add/achivement/:id" element={<AddAchievements />} />
            <Route path="extra-curriculum" element={<ExtraCurr />} />
            <Route path="add/extra-curriculum" element={<AddExtraCurr />} />
            <Route path="add/extra-curriculum/:id" element={<AddExtraCurr />} />
            <Route path="hackathon" element={<Hackathon />} />
            <Route path="add/hackathon" element={<AddHackathons />} />
            <Route path="add/hackathon/:id" element={<AddHackathons />} />
            <Route path="higher-studies" element={<HigherStudies />} />
            <Route path="add/higher-studies" element={<AddHigherStudies />} />
            <Route path="add/higher-studies/:id" element={<AddHigherStudies />} />
            <Route path="placement" element={<Placement />} />
            <Route path="add/placement" element={<AddPlacementDetails />} />
            <Route path="add/placement/:id" element={<AddPlacementDetails />} />
            <Route path="edit-profile" element={<EditProfile />} />




          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />

          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/admin/add-batch" element={<AddBatch />} />
          <Route path="/admin/add-professor" element={<AddProfessor />} />
          <Route path="/admin/add-subject" element={<AddSubject />} />
          <Route path="/admin/assign-subject" element={<AssignSubject />} />
          <Route path="/admin/add-student" element={<AddStudent />} />

          <Route path="/admin/internship/:id" element={<InternshipAdmin />} />
          <Route path="/admin/internship/detail/:id" element={<AddInternship />} />
          <Route path="/admin/ecc/:id" element={<ExtraCurrAdmin />} />
          <Route path="/admin/ecc/detail/:id" element={<AddExtraCurr />} />
          <Route path="/admin/achivement/:id" element={<AchievementAdmin />} />
          <Route path="/admin/achivement/detail/:id" element={<AddAchievements />} />
          <Route path="/admin/hackathon/:id" element={<HackathonAdmin />} />
          <Route path="/admin/hackathon/detail/:id" element={<AddHackathons />} />
          <Route path="/admin/higher-studies/:id" element={<HigherStudiesAdmin />} />
          <Route path="/admin/higher-studies/detail/:id" element={<AddHigherStudies />} />
          <Route path="/admin/placement/:id" element={<PlacementAdmin />} />
          <Route path="/admin/placement/detail/:id" element={<AddPlacementDetails />} />
          <Route path="/admin/edit-profile/:id" element={<EditProfileAdmin />} />

          {/* //professor  */}

          <Route path="/professor" element={<ProfessorHome />} />
          <Route path="/professor/add-attendance/:subjectId/:pr_th" element={<AddAttendance />} />
          <Route path="*" element={<PageNotFound/>} />



        </Routes>


      </Router>
    </userContext.Provider>

  )
}

export default App
