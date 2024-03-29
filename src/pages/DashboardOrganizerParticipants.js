import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/DashboardUser.css";

const DashboardOrganizerParticipant = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [userId, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { eventid } = useParams();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const fetchUserDetails = async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userIdResponse.data);
      console.log("User ID:", userId);

      const response = await axios.get(
        `http://localhost:8080/api/eventparticipants/getall`
      );
      const participantUserIds = response.data;
      const eventIdNumber = parseInt(eventid);

      const matchingUserIds = participantUserIds
        .filter(
          (participant) => parseInt(participant.eventID) === eventIdNumber
        )
        .map((participant) => participant.userID);
      console.log(eventid);
      console.log("User IDs for the matching event:", matchingUserIds);

      const userDetailsPromises = matchingUserIds.map(async (userId) => {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/getUserDetails?userId=${userId}`
        );
        return userResponse.data;
      });

      // Resolve all promises to get user details
      const userDetailsData = await Promise.all(userDetailsPromises);
      setUserDetails(userDetailsData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleCreateEventsClick = () => {
    const url = `/dashboard/organizer/createvents`;
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
          <span onClick={handleMyEventsClick}>
            <b>My Events</b>
          </span>
          <span onClick={handleCreateEventsClick}>Create Events</span>
          <span onClick={handleProfileClick}>Profile</span>
          <span>
            <span onClick={handleLogoutClick}>Logout</span>
          </span>
        </div>
      </div>
      <div className="container">
        <h2>Participants</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map((user) => (
              <tr key={user.userid}>
                <td>{user.userid}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardOrganizerParticipant;
