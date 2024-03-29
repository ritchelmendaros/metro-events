import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            <div style={{width: '40%', position:'relative', display:'flex', backgroundColor: 'white', justifyContent: 'center'}}>
            <img src="bgf1.gif" alt="Design" className='right-image' />
            </div>
            <div style={{width: '60%',height:'100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <div className='left'>
                <div className="logo-container">
                    <img src="textlogo.png" alt="Logo" className='image' />
                </div>
                <div className='text'>
                    <p className="description">Join and get notified with events with ease!</p>
                    <div className='buttonContainer'>
                    <button onClick={handleGetStarted} className="get-started-btn">Get Started</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
