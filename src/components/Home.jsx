import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './shared/Header';
import HeroSection from './HeroSection';
import LatestJobs from './LatestJobs';
import { Accordion } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import Chat from './ai/Chat';
import Footer from './shared/Footer';
import MyAccordion from './MyAccordion';
import GlobalStats from './GlobalStats';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // If user is logged in and is a recruiter, redirect to admin companies page
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
      return;
    }

    // If user is logged in and is a student, stay on home page
    // No need for explicit navigation as we're already on the home page
  }, [user, navigate]);

  // If user is not logged in, don't render the home page content
  if (!user) {
    return null;
  }

  return (
    <>
      <Header/>
      <HeroSection />
      <GlobalStats />
      <LatestJobs />
      <MyAccordion/>
      <Chat />
      <Footer />
    </>
  );
};

export default Home;
