import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import useGetAllJobs from './components/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import Chat from './components/ai/Chat';

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Ensure jobs are fetched on component load
  useGetAllJobs();

  useEffect(() => {
    // Navigate to admin/companies if user is a recruiter
    if (user && user?.role === 'recruiter') {
      navigate('admin/companies');
    }
  }, [navigate, user]);  // Add navigate and user as dependencies for proper handling

  return (
    <>
      <Header />
      <Outlet />
      <Chat />
      <Footer />
    </>
  );
}

export default Layout;
