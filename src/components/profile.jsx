// components/Profile.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from local storage
        const response = await axios.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        });
        setUser(response.data); // Set the user data
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching user profile");
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* Display other user information as needed */}
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Profile;
