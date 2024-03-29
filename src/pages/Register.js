import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    userType: 0,
    username: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const usernameExists = await checkUsernameExists(formData.username);

      if (usernameExists) {
        alert("Username already exists. Please choose a different username.");
        return;
      }
      const registerResponse = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          firstname: formData.firstName,
          lastname: formData.lastName,
          password: formData.password,
          userType: formData.userType,
          username: formData.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User registered successfully:", registerResponse.data);
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user: " + error.message);
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/exists",
        { username },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking username existence:", error);
      throw error;
    }
  };

  return (
    <div className="register-container">
      <img src="textlogo.png" alt="Logo" className="logo-image" />
      <div className="register-content">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <label>Username:</label>
          <input
            type="username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="login-message">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
