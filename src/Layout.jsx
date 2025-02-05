import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import useGetAllJobs from "./components/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import Chat from "./components/ai/Chat";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const getAllJobs = useGetAllJobs(); // ✅ Valid Hook Call

  useEffect(() => {
    getAllJobs(); // ✅ Fetch all jobs when the component mounts
  }, [getAllJobs]); // ✅ Add `getAllJobs` as a dependency

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("admin/companies");
    }
  }, [user, navigate]); // ✅ Separate navigation logic

  return (
    <>
      <Header />
      <Outlet />
      <Chat />
      <Footer />
    </>
  );
};

export default Layout;
