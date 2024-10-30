import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Ref to track dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Close dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/#header");
  };

  const styles = {
    navbar: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      border: 'none',
      transition: 'background-color 0.3s',
      position: 'fixed',
      width: '100%',
      zIndex: 1000,
      top: '0px',
    },
    navLink: {
      color: 'white',
      transition: 'color 0.3s',
      cursor: 'pointer',
      padding: '15px 20px',
      display: 'block',
    },
    dropdown: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1001,
      marginTop: '10px',
      display: dropdownVisible ? 'block' : 'none',
    },
    dropdownItem: {
      padding: '10px 20px',
      cursor: 'pointer',
      color: 'black',
    },
    logo: {
      margin: '-20px',
      height: '60px',
      width: 'auto',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
      marginTop:'10px'
    },
  };

  const handleAvatarClick = () => {
    setDropdownVisible(true); // Show dropdown on avatar click
  };

  return (
    <nav id="menu" className="navbar navbar-default" style={styles.navbar}>
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            <img src="img/logo.png" alt="MSUIIT NMPC Logo" style={styles.logo} />
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/#header" className="page-scroll" style={styles.navLink}>
                Home
              </a>
            </li>
            <li>
              <a href="/#services" className="page-scroll" style={styles.navLink}>
                Services
              </a>
            </li>
            <li>
              <a href="/#portfolio" className="page-scroll" style={styles.navLink}>
                News and Events
              </a>
            </li>
            <li>
              <a href="/#testimonials" className="page-scroll" style={styles.navLink}>
                Testimonials
              </a>
            </li>
            <li style={{ position: 'relative' }} ref={dropdownRef}>
              {isLoggedIn ? (
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg==" // Replace with the path to your avatar image
                  alt="Profile"
                  style={styles.avatar}
                  onClick={handleAvatarClick} // Open dropdown on avatar click
                />
              ) : (
                <Link to="/login" style={styles.navLink}>
                  Log In
                </Link>
              )}
              {isLoggedIn && dropdownVisible && (
                <div style={styles.dropdown}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate("/user/profile");
                      setDropdownVisible(false); // Close dropdown after navigation
                    }}
                  >
                    Profile
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate("/user/orders");
                      setDropdownVisible(false); // Close dropdown after navigation
                    }}
                  >
                    Orders
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
