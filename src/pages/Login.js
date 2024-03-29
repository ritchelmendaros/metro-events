import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/Login.css';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/login',
        {
          username: formData.username,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login successful:', response.data);
      
      if (response.data.user_type === 0) {
        sessionStorage.setItem("username", formData.username);
        navigate(`/dashboard/user`);
      } else if (response.data.user_type === 1) {
        sessionStorage.setItem("username", formData.username);
        navigate(`/dashboard/organizer`);
      } else if (response.data.user_type === 2) {
        sessionStorage.setItem("username", formData.username);
        navigate(`/dashboard/admin`);
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');
      } else {
        alert('Error logging in: ' + error.message);
      }
    }
  };
  
  return (
    <div className="login-container">
      
      <div className='left'>
      <img src="textlogo.png" alt="Logo" className="logo-image" />
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

          <button type="submit">Login</button>
        </form>
        <p className="access-message">Don't have access? <a href="/register">Register</a></p>
      </div>
      </div>
      <div style={{width: '40%'}}>
                    <img src="bgf3.gif" alt="Design" style={{width: '100%', height: '100vh'}} />
      </div> 
    </div>
  );
};

export default Login;
