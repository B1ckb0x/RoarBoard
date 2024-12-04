import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import Home from './Home.js';
import Profile from './components/User/Profile.js';
import Clubs from './Clubs.js';
import Login from './components/User/Login.components.jsx';
import Register from './components/User/Register.components.jsx';
import Logout from './components/User/Logout.components.jsx';
import Calendar from './Calendar.js'; 
import DocAI from './DocAI.js'; 
import ClubCreationForm from './components/ClubCreationForm.js'; 


function App() {
  return (
    <Router>
      <div className="app-background" style={{ backgroundColor: "#f0f0f5", minHeight: "100vh" }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" to="/">RoarBoard</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-item nav-link" to="/Profile">Profile</Link>
              <Link className="nav-item nav-link" to="/Clubs">Clubs</Link>
              <Link className="nav-item nav-link" to="/Calendar">Calendar</Link>
              <Link className="nav-item nav-link" to="/DocAI">Doc the AI</Link>
            </div>
            <div className="ms-auto d-flex">
              <Link className="btn btn-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-danger" to="/logout">Logout</Link>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/docai" element={<DocAI />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/protected" element={<div>Protected content will be here after development.</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
