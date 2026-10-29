import React from 'react';
import { Hero } from '../components/home/Hero';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-page-container">
      <Hero />
    </div>
  );
};

export default Home;
