import React, { useState, useEffect, useCallback } from "react";
import "../css/DashboardOrg.css";
import axios from "axios";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const DashboardOrganizer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserID] = useState("");
  const [error, setError] = useState("");
  const [upvoteCounts, setUpvoteCounts] = useState({});
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

  const fetchEvents = useCallback(async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userId);
      console.log("User ID:", userId);

      const response = await axios.get(
        `http://localhost:8080/api/events/allevents`
      );
      // Filter out events where the organizer ID is not equal to the user ID
      const filteredEvents = response.data.filter(
        (event) => event.organizerId === userId
      );
      const activeEvents = filteredEvents.filter(
        (event) => event.eventStatus !== "Cancelled"
      );
      const cancelledEvents = filteredEvents.filter(
        (event) => event.eventStatus === "Cancelled"
      );
      setEvents(activeEvents);
      setCancelledEvents(cancelledEvents);
      console.log(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("No Events, Join One!");
    }
  }, [username]);

  const fetchUpvotesData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/upvotes/all`);
      const upvotesData = response.data;

      const upvoteCounts = {};

      upvotesData.forEach((upvote) => {
        const { eventid } = upvote;
        if (upvoteCounts[eventid]) {
          upvoteCounts[eventid]++;
        } else {
          upvoteCounts[eventid] = 1;
        }
      });

      console.log("Upvotes Counts:", upvoteCounts);
      setUpvoteCounts(upvoteCounts);
    } catch (error) {
      console.error("Error fetching upvotes data:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchEvents();
      fetchUpvotesData();
    }
  }, [username, fetchEvents]);

  const handleParticipantClick = async (eventId) => {
    navigate(`/dashboard/organizer/participants/${eventId}`);
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
      setCancelledEvents((prevCancelledEvents) => [
        ...prevCancelledEvents,
        events.find((event) => event.eventId === eventId),
      ]);
    } catch (error) {
      console.error("Error updating event status:", error);
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
      <h2>My Events Created</h2>
      <div className="event-listing">
        {events.map((event) => (
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
              <Typography variant="body2" color="text.secondary">
                <strong>Upvotes:</strong> {upvoteCounts[event.eventId] || 0}
              </Typography>
            </CardContent>
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
          </Card>
        ))}
      </div>
      <h2>Cancelled Events</h2>
      <div className="event-listing">
        {cancelledEvents.map((event) => (
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
              <Typography variant="body2" color="text.secondary">
                <strong>Upvotes:</strong> {upvoteCounts[event.eventId] || 0}
              </Typography>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardOrganizer;
