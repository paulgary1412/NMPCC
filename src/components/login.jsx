import React, { useState } from "react";
import logo from "../assets/logo2.jpg"; // Adjust the path based on your structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.imageContainer}>
          <img src={logo} alt="Logo" style={styles.image} />
        </div>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.rememberMeContainer}>
              <input type="checkbox" id="rememberMe" style={styles.checkbox} />
              <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
                Remember Me
              </label>
            </div>
            <button type="submit" style={styles.button}>Login</button>
            <p style={styles.register}>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  loginBox: {
    display: "flex",
    width: "60%", // Adjusted box size
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    padding: "20px", // Added padding to make the logo smaller inside the container
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "80%", // Reduced logo size
    maxHeight: "80%",
    objectFit: "contain",
  },
  formContainer: {
    flex: 1,
    padding: "40px", // Larger padding for more space
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "3rem", // Larger title text
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "2rem", // Larger label text
  },
  input: {
    width: "100%",
    padding: "16px", // Larger input box padding
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1.75rem", // Larger input text
  },
  rememberMeContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  checkbox: {
    width: "25px", // Increase checkbox size
    height: "25px",
    marginRight: "10px", // Space between checkbox and label
  },
  rememberMeLabel: {
    fontSize: "1.75rem", // Larger label text
  },
  button: {
    width: "100%",
    padding: "15px", // Larger button padding
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "2rem", // Larger button text
  },
  register: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "1.75rem", // Larger register text
  },
};

export default Login;
