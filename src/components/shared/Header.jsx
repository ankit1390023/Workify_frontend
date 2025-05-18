import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Bell, Menu, X, ChevronDown, Search, Home, Briefcase, Compass, User, LogOut, Lock } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { setSearchQuery } from "@/redux/jobSlice";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AppliedJobsTable from "../AppliedJobsTable";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

// Navigation styles
const navLinkStyles = {
  base: "relative px-3 py-2 transition-all duration-300",
  active: "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:origin-left after:scale-x-100",
  inactive: "text-muted-foreground hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100"
};

// Navigation items configuration
const navigationConfig = {
  student: [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Jobs" },
    { path: "/browse", label: "Browse" }
  ],
  recruiter: [
    { path: "/admin/companies", label: "Register Company", className: "mr-8" },
    { path: "/admin/jobs", label: "Post Job" }
  ]
};

// Mobile navigation items
const mobileNavItems = {
  student: [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Jobs", path: "/jobs" },
    { icon: <Compass className="w-5 h-5" />, label: "Browse", path: "/browse" },
  ],
  recruiter: [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Register Company", path: "/admin/companies" },
    { icon: <Compass className="w-5 h-5" />, label: "Post Job", path: "/admin/jobs" },
  ]
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appliedJobsOpen, setAppliedJobsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [query, setQuery] = useState("");

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term) => {
    return term.toLowerCase().replace(/\s+/g, '');
  };

  // Implement live search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(setSearchQuery(query));
      if (!location.pathname.includes('/jobs') && query.trim() !== '') {
        navigate('/jobs');
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, dispatch, navigate, location.pathname]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_END_POINT}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setUser(null));
      navigate("/login");
      toast.error("Error logging out");
    }
  };

  // Navigation link component
  const NavItem = ({ to, children, className }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navLinkStyles.base} ${isActive ? navLinkStyles.active : navLinkStyles.inactive} ${className || ''}`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="header-container">
      <div className="flex justify-between items-center px-4 py-3 md:px-10 space-x-4">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              {/* Mobile Menu Content */}
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link to="/" className="text-2xl font-bold text-primary">
                    <span className="text-yellow-500">Work</span>ify
                  </Link>
                </div>
                
                {/* Mobile Search */}
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={handleSearch}
                      type="text"
                      placeholder="Search jobs, companies..."
                      className="w-full pl-9"
                    />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                  {mobileNavItems[user?.role || 'student'].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  {user?.role === "student" && (
                    <button
                      onClick={() => {
                        setAppliedJobsOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>Applied Jobs</span>
                    </button>
                  )}
                  {user?.role === "student" && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/ats-checker"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Briefcase className="w-5 h-5" />
                        <span>ATS Checker</span>
                      </Link>
                      <Link
                        to="/contact"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Compass className="w-5 h-5" />
                        <span>Help & Support</span>
                      </Link>
                    </>
                  )}
                  {user && (
                    <>
                      <Link
                        to="/change-password"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Lock className="w-5 h-5" />
                        <span>Change Password</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted w-full"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                    </>
                  )}
                </nav>

                {/* Mobile User Section */}
                <div className="p-4 border-t">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profile?.avatar} />
                          <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login" className="w-full">
                        <Button className="w-full" onClick={() => setMenuOpen(false)}>
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button variant="outline" className="w-full" onClick={() => setMenuOpen(false)}>
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="text-yellow-500">Work</span>ify
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={handleSearch}
              type="text"
              placeholder="Search jobs, companies..."
              className="w-full pl-9"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {navigationConfig[user?.role || 'student'].map((item) => (
            <NavItem key={item.path} to={item.path} className={item.className}>
              {item.label}
            </NavItem>
          ))}
          {user?.role === "student" && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${navLinkStyles.base} ${navLinkStyles.inactive}`}
              >
                AppliedJobs
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[90vw] max-w-[800px] p-4"
                align="center"
                sideOffset={8}
              >
                <div className="max-h-[70vh] overflow-y-auto">
                  <AppliedJobsTable />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {user?.role === "student" && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${navLinkStyles.base} ${navLinkStyles.inactive}`}
              >
                More 
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center w-full cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ats-checker" className="flex items-center w-full cursor-pointer">
                    <Briefcase className="w-4 h-4 mr-2" />
                    ATS Checker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center w-full cursor-pointer">
                    <Compass className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!user ? (
            <Link to="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md">
                Login
              </Button>
            </Link>
          ) : (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="hidden md:flex cursor-pointer ring-2 ring-blue-500 dark:ring-blue-400">
                    <AvatarImage src={user.profile?.avatar} alt="User Avatar" />
                    <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-background border border-gray-200 dark:border-gray-800 rounded-md shadow-lg">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-16 h-16 ring-2 ring-blue-500 dark:ring-blue-400">
                      <AvatarImage src={user.profile?.avatar} alt="Profile Avatar" />
                      <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h4 className="mt-2 text-lg font-semibold text-foreground">
                      {user?.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>

                    <div className="w-full mt-4 space-y-2 text-sm text-foreground">
                      <div className="flex justify-between">
                        <span className="font-medium">Role:</span>
                        <span>{user.role}</span>
                      </div>
                    </div>

                    <div className="mt-4 w-full flex flex-col gap-3">
                      <Link to="/change-password">
                        <Button 
                          variant="none" 
                          className="w-full flex items-center justify-start gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-0 focus:ring-0 focus:outline-none"
                        >
                          <Lock className="h-5 w-5" />
                          <span className="font-medium">Change Password</span>
                        </Button>
                      </Link>
                      <Link to="/profile">
                        <Button 
                          variant="none" 
                          className="w-full flex items-center justify-start gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-0 focus:ring-0 focus:outline-none"
                        >
                          <User className="h-5 w-5" />
                          <span className="font-medium">See Profile</span>
                        </Button>
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="none"
                        className="w-full flex items-center justify-start gap-3 bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 border-0 focus:ring-0 focus:outline-none"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Mobile Avatar - Non-interactive */}
              <Avatar className="md:hidden ring-2 ring-blue-500 dark:ring-blue-400">
                <AvatarImage src={user.profile?.avatar} alt="User Avatar" />
                <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>

      {/* Full Screen Applied Jobs Sheet */}
      <Sheet open={appliedJobsOpen} onOpenChange={setAppliedJobsOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-0" hideCloseButton>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Applied Jobs</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAppliedJobsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AppliedJobsTable />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;