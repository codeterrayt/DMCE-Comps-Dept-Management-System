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
            <Route path="achivement" element={<Achivements />} />
            <Route path="add/achivement" element={<AddAchievements />} />
            <Route path="extra-curriculum" element={<ExtraCurr />} />
            <Route path="add/extra-curriculum" element={<AddExtraCurr />} />
            <Route path="hackathon" element={<Hackathon />} />
            <Route path="add/hackathon" element={<AddHackathons />} />
            <Route path="higher-studies" element={<HigherStudies />} />
            <Route path="add/higher-studies" element={<AddHigherStudies />} />
            <Route path="placement" element={<Placement />} />
            <Route path="add/placement" element={<AddPlacementDetails />} />
            <Route path="sign-up" element={<SignUpForm />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="test" element={<UploadForm />} />


          </Route>

        </Routes>


      </Router>
    </userContext.Provider>

  )
}

export default App
