import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/DashboardUser.css";

const DashboardAdmin = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [userId, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/allUsers"
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []); // Run only once to fetch the username initially

  useEffect(() => {
    if (username) {
      fetchUserDetails();
    }
  }, [username]); // Fetch user details only after username is set

  const fetchUserDetails = async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userIdResponse.data);
      console.log("User ID:", userId);

      const response = await axios.get(
        "http://localhost:8080/api/organizer-requests/userIds"
      );
      const userIds = response.data;

      const userDetailsPromises = userIds.map(async (userData) => {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/getUserDetails?userId=${userData.userid}`
        );
        return {
          ...userResponse.data,
          request_status: userData.request_status,
        };
      });

      const usersData = await Promise.all(userDetailsPromises);
      setUserDetails(
        usersData.filter((user) => user.request_status === "pending")
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/organizer-requests/updateStatus",
        {
          userId,
          newStatus,
        }
      );
      if (newStatus === "approved" || newStatus === "declined") {
        const updatedUserDetails = userDetails.filter(
          (user) => user.userid !== userId
        );
        setUserDetails(updatedUserDetails);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const approveUser = (userId) => {
    updateUserStatus(userId, "approved");
    console.log(`Approving user with ID: ${userId}`);
  };

  const declineUser = (userId) => {
    updateUserStatus(userId, "declined");
    console.log(`Declining user with ID: ${userId}`);
  };

  const goToRequests = () => {
    navigate(`/dashboard/admin?userId=${userId}`);
  };

  const goToEvents = () => {
    navigate(`/dashboard/admin/events?userId=${userId}`);
  };

  const goToProfile = () => {
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
          <span onClick={goToRequests}>
            <b>Requests</b>
          </span>
          <span onClick={goToEvents}>Events</span>
          <span onClick={goToProfile}>Profile</span>
          <span onClick={handleLogoutClick}>Logout</span>
        </div>
      </div>
      <div className="container">
        <h2>Admin Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map((user) => (
              <tr key={user.userid}>
                <td>{user.userid}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.request_status}</td>
                <td>
                  <button onClick={() => approveUser(user.userid)}>
                    Approve
                  </button>
                  <button
                    onClick={() => declineUser(user.userid)}
                    className="decline-button"
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>User Type</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.userid}>
                <td>{user.userid}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>
                  {user.userType === 0 && "User"}
                  {user.userType === 1 && "Organizer"}
                  {user.userType === 2 && "Admin"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardAdmin;
