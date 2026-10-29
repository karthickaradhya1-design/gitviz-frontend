import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { CtaBand } from '../components/home/CtaBand';
import './Home.css';

export const Home: React.FC = () => {
  usePageTitle('Home');

  return (
    <div className="home-page">
      <div className="home-page-container">
        <Hero />
        <Features />
      </div>
      <HowItWorks />
      <CtaBand />
    </div>
  );
};

export default Home;
