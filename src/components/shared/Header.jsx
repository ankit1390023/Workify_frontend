import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Bell, Moon, Sun, Menu } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { setSearchQuery } from "@/redux/jobSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const [query, setQuery] = useState("");
  // Search company by text
  const searchJobHandler = () => {
    console.log("searchJobHandler");
    dispatch(setSearchQuery(query));
    navigate("/browse");
  };

 
  // Set dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_END_POINT}/user/logout`,
        {},
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success("Logged out successfully");
        dispatch(setUser(null));
        navigate("/login");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      toast.error("Error logging out");
    }
  };

  return (
    <header className="bg-white dark:bg-black shadow-md sticky top-0 z-50 font-sans">
      <div className="flex justify-between items-center px-6 py-3 md:px-10 space-x-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-yellow-400">
          <span className="text-yellow-500 dark:text-blue-300">Work</span>ify
        </Link>

        {/* Hamburger Menu */}
        <Button
          aria-label="Menu"
          variant="ghost"
          className="block md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-1/3">
          <Input
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search jobs, companies..."
            className="w-full pl-4 border border-gray-300 dark:border-gray-600 focus:border-blue-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
          />
          <Button
         onClick={searchJobHandler}
            variant="default"
            className="ml-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Search
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {user && user.role === "student"
            ? ["Home", "Contact", "Jobs", "Browse"].map((link) => (
              <NavLink
                key={link}
                to={`/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `py-2 px-4 transition-colors duration-200 ${isActive
                    ? "text-yellow-500 dark:text-yellow-400 border-b-2 border-yellow-500"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                {link}
              </NavLink>
            ))
            : [
              { name: "Companies", path: "/admin/companies" },
              { name: "Jobs", path: "/admin/jobs" },
            ].map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `py-2 px-4 transition-colors duration-200 ${isActive
                    ? "text-yellow-500 dark:text-yellow-400 border-b-2 border-yellow-500"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            aria-label="Toggle Dark Mode"
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </Button>

          {/* Notification Bell */}
          <Button variant="ghost" aria-label="Notifications" className="relative">
            <Bell size={24} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile / Login */}
          {!user ? (
            <Link to="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-md">
                Login
              </Button>
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.profile?.avatar} alt="User Avatar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                <div className="flex flex-col items-center">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.profile?.avatar} alt="Profile Avatar" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <h4 className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {user?.fullName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>

                  {/* Profile Details */}
                  <div className="w-full mt-4 space-y-2 text-sm text-gray-800 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-medium">Role:</span>
                      <span>{user.role}</span>
                    </div>
                    {/* Add other details dynamically */}
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 w-full flex flex-col gap-2">
                    {user.role === "recruiter" && (
                      <Link to="/admin/dashboard">
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md">
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        See Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="default"
                      className="w-full bg-red-500 text-white hover:bg-red-600"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800 p-4 shadow-lg space-y-2">
          {["Home", "Contact", "Jobs", "Browse"].map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
