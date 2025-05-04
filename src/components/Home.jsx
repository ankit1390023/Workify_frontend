import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './shared/Header';
import HeroSection from './HeroSection';
import LatestJobs from './LatestJobs';
import { Accordion } from './ui/accordion';
import useGetAllJobs from './hooks/useGetAllJobs';
import Chat from './ai/Chat';
import Footer from './shared/Footer';
import MyAccordion from './MyAccordion';

const Home = () => {
  useGetAllJobs();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    }
  }, [user, navigate]); // Added dependencies to prevent stale closures

  return (
    <>
      <Header/>
      <HeroSection />
      <LatestJobs />
      <MyAccordion/>
      <Chat />
      <Footer />
    </>
  );
};

export default Home;
