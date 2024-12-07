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
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import Shopping from "./components/Shopping";
import Pharmacy from "./components/Pharmacy";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/profile"; // Import Profile component
import Checkout from "./components/Checkout"; 
import Cart from "./components/Cart";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { jwtDecode } from "jwt-decode"; // Correct import syntax
import { Navigate } from "react-router-dom";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});
const ProtectedRoute = ({ element, role, redirectTo }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to={redirectTo} />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.usertype === role) {
      return element;
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }

  return <Navigate to={redirectTo} />;
};

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
            </>
          }
        />
        {/* Authentication Routes */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Profile Route */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Service Routes */}
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute 
              element={<Dashboard />} 
              role="admin" 
              redirectTo="/" 
            />
          } 
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
                  
      </Routes>
    </Router>
  );
};

export default App;
