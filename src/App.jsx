import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile/Profile';
import JobDescription from './components/JobDescription';
import Contact from './components/contact/Contact';
import Companies from './components/admin/Companies';
import CompaniesCreate from './components/admin/CompaniesCreate';
import CompanyDetailsUpdate from './components/admin/CompanyDetailsUpdate';
import AdminJobs from './components/admin/AdminJobs';
import PostJobs from './components/admin/PostJobs';
import JobDetailsUpdate from './components/admin/JobDetailsUpdate';
import Applicants from './components/admin/Applicants';
import ApplicantsCards from './components/admin/ApplicantCard';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

const appRouter = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/browse', element: <Browse /> },

  // Auth Routes
  { path: '/login', element: <Login /> },
  { path: '/signUp', element: <SignUp /> },
  { path: '/profile', element: <Profile /> },
  { path: '/jobDescription/:id', element: <JobDescription /> },

  // Admin Routes (Protected)
  { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompaniesCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanyDetailsUpdate /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/postJobs', element: <ProtectedRoute><PostJobs /></ProtectedRoute> },
  { path: '/admin/companyUpdateDetails/:id', element: <ProtectedRoute><JobDetailsUpdate /></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },
  { path: '/admin/jobs/view-application/:id', element: <ProtectedRoute><ApplicantsCards /></ProtectedRoute> }
]);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
};

export default App;
