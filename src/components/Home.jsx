import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './shared/Header';
import HeroSection from './HeroSection';
import LatestJobs from './LatestJobs';
import { Accordion } from './ui/accordion';
import useGetAllJobs from './hooks/useGetAllJobs';
import useGlobalStats from './hooks/useGlobalStats';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import Chat from './ai/Chat';
import Footer from './shared/Footer';
import MyAccordion from './MyAccordion';
import GlobalStats from './GlobalStats';

const Home = () => {
  useGetAllJobs();
  useGlobalStats();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
  }, [user, navigate]);

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
