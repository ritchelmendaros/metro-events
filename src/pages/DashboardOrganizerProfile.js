import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/DashboardUser.css";

const DashboardOrganizerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdResponse = await axios.get(
          `http://localhost:8080/api/users/getUserId?username=${username}`
        );
        const userId = userIdResponse.data;
        setUserId(userId);
        console.log("User ID:", userId);
        const response = await axios.get(
          `http://localhost:8080/api/users/getUserDetails?userId=${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);


  const getUserRole = (userType) => {
    switch (userType) {
      case 0:
        return "User";
      case 1:
        return "Organizer";
      case 2:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  const handleCreateEventsClick = () => {
    const url = `/dashboard/organizer/createevents`;
    navigate(url);
  };

  const handleMyEventsClick = () => {
    navigate(`/dashboard/organizer`);
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/organizer/profile`);
  };

  const handleLogoutClick = () => {
    navigate(`/`);
  };

  return (
    <>
      <div className="dashboard">
        <div className="logo-container">
          <img src="/textlogo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <span onClick={handleMyEventsClick}>My Events</span>
          <span onClick={handleCreateEventsClick}>Create Events</span>
          <span onClick={handleProfileClick}><b>Profile</b></span>
          <span><span onClick={handleLogoutClick}>Logout</span></span>
        </div>
      </div>
      <h2>Organizer Profile</h2>
      {userData && (
        <div className="user-details">
          <div className="name-role">
            <p>
              Name: {userData.firstname}, {userData.lastname}
            </p>
            <p>Role: {getUserRole(userData.userType)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardOrganizerProfile;
