import { useState } from 'react'
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

function App() {



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/dmce" element={<SideNav />}>
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="internship" element={<Internship />} />
          <Route path="achivement" element={<Achivements />} />
          <Route path="extra-curriculum" element={<ExtraCurr />} />
          <Route path="hackathon" element={<Hackathon />} />
          <Route path="higher-studies" element={<HigherStudies />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="login" element={<LoginForm />} />

        </Route>

      </Routes>


    </Router>

  )
}

export default App
