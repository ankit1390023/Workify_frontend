import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from './components/ui/sonner.jsx';
import Layout from './Layout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';  // Ensure store is imported correctly
import Profile from './components/Profile/Profile';
import JobDescription from './components/JobDescription';
import Contact from './components/contact/Contact';
import { PersistGate } from 'redux-persist/integration/react';
import Companies from './components/admin/Companies';
import CompaniesCreate from './components/admin/CompaniesCreate';
import CompanyDetailsUpdate from './components/admin/CompanyDetailsUpdate';
import AdminJobs from './components/admin/AdminJobs';
import PostJobs from './components/admin/PostJobs';
import JobDetailsUpdate from './components/admin/JobDetailsUpdate';
import Applicants from './components/admin/Applicants';
import ApplicantsCards from './components/admin/ApplicantCard';




const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="/browse" element={<Browse />} />

      {/* Auth Routes */}
      <Route path="login" element={<Login />} />
      <Route path="signUp" element={<SignUp />} />

      {/* Protected Routes */}
      <Route path="profile" element={<Profile />} />
      <Route path="jobDescription/:id" element={<JobDescription />} />

      {/*for recruiter starts from here */}
      <Route path="/admin/companies" element={<Companies />} />
      <Route path="/admin/companies/create" element={<CompaniesCreate />} />
      <Route path="/admin/companies/:id" element={<CompanyDetailsUpdate />} />
      <Route path="/admin/jobs" element={<AdminJobs />} />
      <Route path="/admin/postJobs" element={<PostJobs />} />
      <Route path="/admin/companyUpdateDetails/:id" element={<JobDetailsUpdate />} />
      <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
      <Route path="/admin/jobs/view-applicantion/:id" element={<ApplicantsCards />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap the app with Provider */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={appRouter} />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
