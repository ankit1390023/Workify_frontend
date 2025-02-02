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
import ProtectedRoute from './components/admin/ProtectedRoute';

import { Auth0Provider } from '@auth0/auth0-react';


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

      <Route path="profile" element={<Profile />} />
      <Route path="jobDescription/:id" element={<JobDescription />} />

      {/*for recruiter starts from here */}
      <Route path="/admin/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
      <Route path="/admin/companies/create" element={<ProtectedRoute><CompaniesCreate /></ProtectedRoute>
       } />
      <Route path="/admin/companies/:id" element={<ProtectedRoute><CompanyDetailsUpdate /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={
        <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>} />
      <Route path="/admin/postJobs" element={<ProtectedRoute><PostJobs /></ProtectedRoute>} />
      <Route path="/admin/companyUpdateDetails/:id" element={<ProtectedRoute>
        <JobDetailsUpdate />
      </ProtectedRoute>} />
      <Route path="/admin/jobs/:id/applicants" element={
        <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>} />
      <Route path="/admin/jobs/view-applicantion/:id" element={<ProtectedRoute><ApplicantsCards /></ProtectedRoute>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="{yourDomain}"
      clientId="{yourClientId}"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Provider store={store}>  {/* Wrap the app with Provider */}
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <RouterProvider router={appRouter} />
          <Toaster />
        </PersistGate>
      </Provider>
    </Auth0Provider>,
  </React.StrictMode>
);
