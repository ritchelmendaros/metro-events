import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashboardUser.css";
import axios from "axios";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const DashboardUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [eventIds, setEventIds] = useState([]);
  const [userId, setUserID] = useState("");
  const [upvoteCounts, setUpvoteCounts] = useState({});
  const [cancelledEvents, setCancelledEvents] = useState([]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      setUserID(userIdResponse.data);
      console.log("User ID:", userId);

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
      const eventsResponse = await axios.post(
        `http://localhost:8080/api/events/byEventIds`,
        eventId,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEvents(eventsResponse.data);

      // Check for cancelled events
      const cancelledEvents = eventsResponse.data.filter(
        (event) => event.eventStatus === "Cancelled"
      );
      setCancelledEvents(cancelledEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("No Events, Join One!");
    }
  }, [username]);

  const fetchUpvotesData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/upvotes/all`);
      const upvotesData = response.data;

      // Create an object to store counts for each event ID
      const upvoteCounts = {};

      // Iterate through the upvotes data to count the upvotes for each event ID
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

  const handleUpvote = async (eventId) => {
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8080/api/users/getUserId?username=${username}`
      );
      const userId = userIdResponse.data;
      console.log("User ID:", userId);

      await axios.post(
        `http://localhost:8080/api/upvotes/add`,
        { 
          userid: userId, 
          eventid: eventId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(`Successfully upvoted event with ID: ${eventId}`);
      fetchEvents();
      fetchUpvotesData(); 
    } catch (error) {
      console.error("Error upvoting event:", error);
    }
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
          <span onClick={handleEventsClick}>Events</span>
          <span onClick={handleProfileClick}>Profile</span>
          <span>
            <span onClick={handleLogoutClick}>Logout</span>
          </span>
        </div>
      </div>
      <div className="main-content">
        <div className="notification-box-container">
          <Card className="notification-box-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              {cancelledEvents.length > 0 ? (
                <ul>
                  {cancelledEvents.map((event) => (
                    <li key={event.eventId}>
                      The Event <b>"{event.eventName}"</b> which you want to participate was cancelled.
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="event-listing">
          <h2 style={{ marginRight: '290px' }}>My Events</h2>
          {error && <div className="error-message">{error}</div>}
          {events
            .filter((event) => event.eventStatus !== "Cancelled") 
            .map((event) => (
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
                    <strong>Organizer ID:</strong>{" "}
                    {event.organizerId ? event.organizerId : "Unknown"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Upvotes:</strong>{" "}
                    {upvoteCounts[event.eventId] || 0}
                  </Typography>
                </CardContent>
                <IconButton onClick={() => handleUpvote(event.eventId)}>
                  <div className="UpVote">
                    <ThumbUpIcon />
                  </div>
                </IconButton>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default DashboardUser;
