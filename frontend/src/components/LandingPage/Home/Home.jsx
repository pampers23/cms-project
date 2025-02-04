import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/articles');
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Article Project</h1>
        <p>Post your Articles here</p>
        <button className="cta-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Home;
