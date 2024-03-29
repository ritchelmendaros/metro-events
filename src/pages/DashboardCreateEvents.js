import React, { useState, useEffect, useCallback } from "react";
import "../css/DashboardOrg.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardCreateEvents = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserID] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    location: "",
    organizerId: "",
    eventStatus: "Upcoming"
  });

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetchEvents();
    }
  }, [username]);

  const fetchEvents = useCallback(async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userId);
      console.log("User ID:", userId);
      setFormData(prevState => ({
        ...prevState,
        organizerId: userId
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("No Events, Join One!");
    }
  }, [username]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/events/addevents",
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
  
      navigate("/dashboard/organizer");
    } catch (error) {
      console.error("Error creating event:", error.message);
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
          <span><b>Create Events</b></span>
          <span onClick={handleProfileClick}>Profile</span>
          <span><span onClick={handleLogoutClick}>Logout</span></span>
        </div>
      </div>
      <div className="create-container">
        <div className="create-content">
          <h2>Create Events</h2>
          <form onSubmit={handleCreateEvent}>
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />

            <label htmlFor="eventDescription">Description:</label>
            <input
              type="text"
              id="eventDescription"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
            />

            <label htmlFor="eventDate">When:</label>
            <input
              type="text"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
            />

            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardCreateEvents;
