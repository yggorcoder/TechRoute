import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 2. Montando a página na ordem correta */}
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;