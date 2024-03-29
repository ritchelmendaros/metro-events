import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DashboardUserEvents.css";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";

const DashboardUserEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userId, setUserID] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const eventIds = queryParams.get('eventIds') ? queryParams.get('eventIds').split(',') : [];
  const [event_id, setUserEvent_ID] = useState("");
// for push
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
      setUserID(userIdResponse.data);
      console.log("User ID:", userIdResponse.data);

      const response = await axios.get(
        "http://localhost:8080/api/events/allevents",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEvents(response.data);
      console.log('Event IDs:', eventIds);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventsClick = () => {
    const url = `/dashboard/user/events?eventIds=${eventIds.join(",")}`;
    navigate(url);
  };

  const handleMyEventsClick = () => {
    navigate(`/dashboard/user`);
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/user/profile?userId=${userId}`);
  };

  const handleLogoutClick = () => {
    navigate(`/`);
  };

  const handleJoinEvent = async (eventId) => {
  try {
    console.log("User ID:", userId);
    console.log("Event ID:", eventId);
    setUserEvent_ID(eventId);

    await axios.post(
      "http://localhost:8080/api/eventparticipants/add",
      {
        eventID: eventId,
        userID: userId, 
        participantStatus: "accepted",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("User joined event successfully");
    setEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));

  } catch (error) {
    console.log("User ID:", userId);
    console.log("Event ID:", eventId);
    console.error("Error joining event:", error);
  }
};

  

  const filteredEvents = events.filter(event => !eventIds.includes(event.eventId.toString()));

  return (
    <>
      <div className="dashboard">
        <div className="logo-container">
          <img
            src="/textlogo.png"
            alt="Logo"
            className="logo-image"
          />
        </div>
        <div className="nav-links">
          <span onClick={handleMyEventsClick}>My Events</span>
          <span onClick={handleEventsClick}>
            <b>Events</b>
          </span>
          <span onClick={handleProfileClick}>Profile</span>
          <span onClick={handleLogoutClick}>Logout</span>
        </div>
      </div>
      <h2>Events</h2>
      <div className="event-listing" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                  onClick={() => handleJoinEvent(event.eventId)}
                  variant="contained"
                  sx={{ backgroundColor: "#051529", color: "white" , letterSpacing: "2px", marginTop: "0"}}
                >
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardUserEvents;
