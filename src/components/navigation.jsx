import React from "react";
import { Link } from "react-router-dom";

export const Navigation = (props) => {
  const styles = {
    navbar: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background with opacity
      backdropFilter: 'blur(10px)', // Apply blur effect
      border: 'none',
      transition: 'background-color 0.3s',
      position: 'fixed',
      width: '100%',
      zIndex: 1000,
    },
    navLink: {
      color: 'white',
      transition: 'color 0.3s',
    },
    navLinkHover: {
      color: 'rgba(255, 255, 255, 0.8)', // Lighter on hover
    },
    logo: {
      margin: '-20px',
      height: '60px', // Adjust the height as needed
      width: 'auto', // Maintain the aspect ratio
    },
    loginLink: {
      marginLeft: 'auto', // Pushes the link to the rightmost side
    },
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
              <a href="#features" className="page-scroll" style={styles.navLink}>
                
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll" style={styles.navLink}>
                About
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll" style={styles.navLink}>
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll" style={styles.navLink}>
                Gallery
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll" style={styles.navLink}>
                Testimonials
              </a>
            </li>
            <li>
              <Link to="/login" style={styles.navLink}>Log In</Link> {/* Use Link here */}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};
