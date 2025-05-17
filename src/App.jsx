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
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ChangePassword from './components/auth/ChangePassword';
import ATSChecker from './components/Resume_parser/ATSChecker';

// Error boundary component
const ErrorBoundary = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </div>
    </div>
  );
};

const appRouter = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/browse', element: <Browse /> },
  { path: '/dashboard', element: <Dashboard /> },

  // Auth Routes
  { 
    path: '/login', 
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  { path: '/signUp', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/change-password', element: <ChangePassword /> },
  { path: '/profile', element: <Profile /> },
  { path: '/jobDescription/:id', element: <JobDescription /> },

  // Admin Routes (Protected)
  { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompaniesCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanyDetailsUpdate /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/postJobs', element: <ProtectedRoute><PostJobs /></ProtectedRoute> },
  { path: '/admin/jobUpdateDetails/:id', element: <ProtectedRoute><JobDetailsUpdate /></ProtectedRoute> },
  { path: '/admin/companyUpdateDetails/:id', element: <ProtectedRoute><CompanyDetailsUpdate /></ProtectedRoute> },  
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },
  { path: '/admin/jobs/view-application/:id', element: <ProtectedRoute><ApplicantsCards /></ProtectedRoute> },

  // ATS Checker Routes
  { path: '/ats-checker', element: <ProtectedRoute><ATSChecker /></ProtectedRoute> }
]);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
};

export default App;
