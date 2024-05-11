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
import About from './components/About';
import Internship from './components/Internship';
import Achivements from './components/Achivements';
import ExtraCurr from './components/ExtraCurr';
import Hackathon from './components/Hackathon';
import HigherStudies from './components/HigherStudies';
import SignUpForm from './components/SignUp';
import LoginForm from './components/Login';
import UploadForm from './components/UploadForm';
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
import DetailInternshipAdmin from './components/Admin/DetailInternship.Admin';
import ExtraCurrAdmin from './components/Admin/ExtraCurr.Admin';
import DetailExtraCurrAdmin from './components/Admin/DetailExtraCurr.Admin';
import AchievementAdmin from './components/Admin/Achievement.Admin';
import HackathonAdmin from './components/Admin/Hackathon.Admin';
import DetailHackathonAdmin from './components/Admin/DetailHackathonAdmin';
import HigherStudiesAdmin from './components/Admin/HigherStudies.Admin';
import DetailHigherStudyAdmin from './components/Admin/DetailHigherStudy.Admin';
import PlacementAdmin from './components/Admin/Placement.Admin';
import DetailPlacementAdmin from './components/Admin/DetailPlacementAdmin';
import EditProfileAdmin from './components/Admin/EditProfile.Admin';

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
            <Route path="about" element={<About />} />
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

          <Route path="/Admin" element={<HomeAdmin />} />

          <Route path="/admin/internship/:id" element={<InternshipAdmin />} />
          <Route path="/admin/internship/detail/:id" element={<DetailInternshipAdmin />} />
          <Route path="/admin/ecc/:id" element={<ExtraCurrAdmin />} />
          <Route path="/admin/ecc/detail/:id" element={<DetailExtraCurrAdmin />} />
          <Route path="/admin/achivement/:id" element={<AchievementAdmin />} />
          <Route path="/admin/achivement/detail/:id" element={<DetailExtraCurrAdmin />} />
          <Route path="/admin/hackathon/:id" element={<HackathonAdmin />} />
          <Route path="/admin/hackathon/detail/:id" element={<DetailHackathonAdmin />} />
          <Route path="/admin/higher-studies/:id" element={<HigherStudiesAdmin />} />
          <Route path="/admin/higher-studies/detail/:id" element={<DetailHigherStudyAdmin />} />
          <Route path="/admin/placement/:id" element={<PlacementAdmin />} />
          <Route path="/admin/placement/detail/:id" element={<DetailPlacementAdmin />} />
          <Route path="/admin/edit-profile/:id" element={<EditProfileAdmin />} />


        </Routes>


      </Router>
    </userContext.Provider>

  )
}

export default App
