import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-page-container">
      <Hero />
      <Features />
    </div>
  );
};

export default Home;
