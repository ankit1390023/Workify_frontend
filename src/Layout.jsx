import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import useGetAllJobs from './components/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'


const Layout = () => {
  useGetAllJobs() // Fetch all jobs on component mount
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Navigate to admin/companies if user is a recruiter
    if (user && user?.role == 'recruiter') {
     navigate('admin/companies');
    }
  },[])
  return (
    <>
      <Header />
      <Outlet />{/*jha bhi outlet doge vha chize change hogi i.e header footer same rhngi bich ka changehogi*/}
      <Footer />
    </>
  )
}

export default Layout