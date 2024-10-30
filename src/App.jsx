import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import Login from "./components/login"; 
import Register from "./components/register";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import Shopping from "./components/Shopping";
import Pharmacy from "./components/Pharmacy";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/profile"; // Import Profile component

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLandingPageData(JsonData);
    
    // Check if the token exists in localStorage on app load
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update logged in state based on token presence
  }, []);

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header data={landingPageData.Header} />
              <About data={landingPageData.About} />
              <Services data={landingPageData.Services} />
              <Gallery data={landingPageData.Gallery} />
              <Testimonials data={landingPageData.Testimonials} />
              <Contact data={landingPageData.Contact} />
            </>
          }
        />
        {/* Authentication Routes */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Profile Route */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Add Profile Route */}
        
        {/* Service Routes */}
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
