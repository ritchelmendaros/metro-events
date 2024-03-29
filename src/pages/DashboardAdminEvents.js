import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DashboardUser.css";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

const DashboardAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userId, setUserID] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const eventIds = queryParams.get("eventIds")
    ? queryParams.get("eventIds").split(",")
    : [];
  const [event_id, setUserEvent_ID] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetchEvents();
    }
  }, [username]);

  const fetchEvents = async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userIdResponse.data);
      console.log("User ID:", userId);

      const response = await axios.get(
        "http://localhost:8080/api/events/allevents",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const filteredEvents = response.data.filter(
        (event) => event.eventStatus !== "Cancelled"
      );
      setEvents(filteredEvents);
      console.log("Event IDs:", eventIds);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleMyEventsClick = () => {
    navigate(`/dashboard/admin/events?userId=${userId}`);
  };

  const handleMyRequestsClick = () => {
    navigate(`/dashboard/admin?userId=${userId}`);
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/admin/profile?userId=${userId}`);
  };

  const handleCancelEvent = async (eventId) => {
    try {
      console.log("Event ID:", eventId);
      setUserEvent_ID(eventId);

      await axios.post("http://localhost:8080/api/events/cancel", eventId, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Event status updated to Cancelled");
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId)
      );
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  const handleParticipantClick = async (eventId) => {
    navigate(`/dashboard/admin/participants/${eventId}`);

  };

  const handleLogoutClick = () => {
    navigate("/");
  };

  const filteredEvents = events.filter(
    (event) => !eventIds.includes(event.eventId.toString())
  );

  return (
    <>
      <div className="dashboard">
        <div className="logo-container">
          <img src="/textlogo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <span onClick={handleMyRequestsClick}>Requests</span>
          <span onClick={handleMyEventsClick}>
            <b>Events</b>
          </span>
          <span onClick={handleProfileClick}>Profile</span>
          <span onClick={handleLogoutClick}>Logout</span>
        </div>
      </div>
      <h2>Events</h2>
      <div className="event-listing">
        {filteredEvents.map((event) => (
          <Card key={event.eventId} className="event-container">
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {event.eventName ? event.eventName : "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Description:</strong>{" "}
                {event.eventDescription ? event.eventDescription : "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong>{" "}
                {event.location ? event.location : "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>When:</strong>{" "}
                {event.eventDate ? event.eventDate : "Unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong>{" "}
                {event.eventStatus ? event.eventStatus : "Unknown"}
              </Typography>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => handleCancelEvent(event.eventId)}
                  variant="contained"
                  sx={{
                    backgroundColor: "#570000",
                    color: "white",
                    letterSpacing: "2px",
                    marginTop: "0",
                    marginRight: "8px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleParticipantClick(event.eventId)}
                  variant="contained"
                  sx={{
                    backgroundColor: lightBlue,
                    color: "white",
                    letterSpacing: "2px",
                    marginTop: "0",
                  }}
                >
                  Participants
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardAdminEvents;
