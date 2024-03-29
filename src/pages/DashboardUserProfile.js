import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/DashboardUser.css";

const DashboardUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const [eventIds, setEventIds] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getUserDetails?userId=${userId}`
        );
        setUserData(response.data);
        const eventParticipantResponse = await axios.post(
          `http://localhost:8080/api/eventparticipants/check`,
          userId,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const eventId = eventParticipantResponse.data;
        console.log("Event ID:", eventId);
        setEventIds(eventId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleRequestOrganizer = async () => {
    try {
      // Check if the user has already sent a request
      const response = await axios.get(
        "http://localhost:8080/api/organizer-requests/userIds"
      );
      const requests = response.data;
      const userRequest = requests.find(
        (request) => request.userid === userId && request.request_status === "pending"
      );
  
      if (userRequest) {
        console.log("User has already sent a request to be an organizer.");
      } else {
        await axios.post(
          "http://localhost:8080/api/organizer-requests/request",
          {
            userid: userId,
            requestStatus: "pending",
            hasRequested: 1
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

  const handleMyEventsClick = () => {
    navigate(`/dashboard/user`);
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/user/profile?userId=${userId}`);
  };

  const handleEventsClick = () => {
    const url = `/dashboard/user/events?eventIds=${eventIds.join(",")}`;
    navigate(url);
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
          <span onClick={handleEventsClick}>
            Events
          </span>
          <span onClick={handleProfileClick}><b>Profile</b></span>
          <span onClick={handleLogoutClick}>Logout</span>
        </div>
      </div>
      <h2>User Profile</h2>
      {userData && (
        <div className="user-details">
          <div className="name-role">
            <p>
              Name: {userData.firstname}, {userData.lastname}
            </p>
            <p>Role: {getUserRole(userData.userType)}</p>
          </div>
          {!requestSent && (
            <Button
              className="buttonrequests"
              variant="contained"
              onClick={handleRequestOrganizer}
              sx={{
                backgroundColor: "white",
                color: "#051529",
                letterSpacing: "2px",
                marginTop: "0",
                fontWeight: "bold",
              }}
            >
              Request to be an organizer
            </Button>
          )}

          <div className="request-sent">{requestSent && <p>Request has been sent!</p>}</div>
        </div>
      )}
    </>
  );
};

export default DashboardUserProfile;
