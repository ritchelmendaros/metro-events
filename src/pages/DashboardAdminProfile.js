import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../css/DashboardUser.css";

const DashboardAdminProfile = () => {
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

  const handleRequestOrganizer = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/organizer-requests/userIds"
      );
      const requests = response.data;
      const userRequest = requests.find(
        (request) =>
          request.userid === userId && request.request_status === "pending"
      );

      if (userRequest) {
        console.log("User has already sent a request to be an organizer.");
      } else {
        await axios.post(
          "http://localhost:8080/api/organizer-requests/request",
          {
            userid: userId,
            requestStatus: "pending",
            hasRequested: 1,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error sending request to be an organizer:", error);
    }
  };

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

  const goToRequests = () => {
    navigate(`/dashboard/admin?userId=${userId}`);
  };

  const handleMyEventsClick = () => {
    navigate(`/dashboard/admin/events?userId=${userId}`);
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/admin/profile?userId=${userId}`);
  };

  const handleLogoutClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="dashboard">
        <div className="logo-container">
          <img src="/textlogo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <span onClick={goToRequests}>Requests</span>
          <span onClick={handleMyEventsClick}>Events</span>
          <span onClick={handleProfileClick}>
            <b>Profile</b>
          </span>
          <span onClick={handleLogoutClick}>Logout</span>
        </div>
      </div>
      <h2>Admin Profile</h2>
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

export default DashboardAdminProfile;
