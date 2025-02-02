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
import { clearUser, setUser } from "@/redux/authSlice";
import { setSearchQuery } from "@/redux/jobSlice";
import Darkmode from "../Darkmode";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check the dark mode setting from local storage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Search company by text
  const searchJobHandler = () => {
    dispatch(setSearchQuery(query));
    navigate("/browse");
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // clear user
      dispatch(clearUser());
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
      <div className="flex justify-between items-center px-2 py-3 md:px-10 space-x-4">
        <div className="flex">
          <Button
            aria-label="Menu"
            variant="ghost"
            className="block md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </Button>
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-yellow-400">
            <span className="text-yellow-500 dark:text-blue-300">Work</span>ify
          </Link>
        </div>

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
              { name: "Home", path: "/home" },
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

        <div className="flex items-center space-x-4">
          <Darkmode darkMode={darkMode} setDarkMode={setDarkMode} />

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

                  <div className="w-full mt-4 space-y-2 text-sm text-gray-800 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-medium">Role:</span>
                      <span>{user.role}</span>
                    </div>
                  </div>

                  <div className="mt-4 w-full flex flex-col gap-2">
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
