import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Bell, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { setSearchQuery } from "@/redux/jobSlice";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
      // If we're not on the jobs page, navigate to it
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
        localStorage.removeItem("acessToken");
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
    <header className="bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 font-sans">
      <div className="flex justify-between items-center px-2 py-3 md:px-10 space-x-4">
        <div className="flex">
          <Button
            aria-label="Menu"
            variant="ghost"
            className="block md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} className="text-foreground" />
          </Button>
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="text-yellow-500">Work</span>ify
          </Link>
        </div>

        <div className="hidden md:flex items-center w-1/3">
          <Input
            value={query}
            onChange={handleSearch}
            type="text"
            placeholder="Search jobs, companies..."
            className="w-full pl-4 border border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 rounded-md bg-background"
          />
        </div>

        <nav className="hidden md:flex space-x-6 text-lg">
          {user?.role === "recruiter"
            ? ["Companies", "Jobs"].map((link) => (
              <NavLink
                key={link}
                to={`/admin/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `py-2 px-4 transition-colors duration-200 ${
                    isActive
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                {link}
              </NavLink>
            ))
            : ["Home", "Contact", "Jobs", "Browse"].map((link) => (
              <NavLink
                key={link}
                to={`/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `py-2 px-4 transition-colors duration-200 ${
                    isActive
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                {link}
              </NavLink>
            ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!user ? (
            <Link to="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md">
                Login
              </Button>
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-blue-500 dark:ring-blue-400">
                  <AvatarImage src={user.profile?.avatar} alt="User Avatar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-background border border-gray-200 dark:border-gray-800 rounded-md shadow-lg">
                <div className="flex flex-col items-center">
                  <Avatar className="w-16 h-16 ring-2 ring-blue-500 dark:ring-blue-400">
                    <AvatarImage src={user.profile?.avatar} alt="Profile Avatar" />
                    <AvatarFallback>AS</AvatarFallback>
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

                  <div className="mt-4 w-full flex flex-col gap-2">
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        See Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="default"
                      className="w-full bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
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
        <div className="md:hidden fixed inset-0 bg-background/95 z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <Link to="/" className="text-2xl font-bold text-primary">
              <span className="text-yellow-500">Work</span>ify
            </Link>
            <Button
              variant="ghost"
              onClick={() => setMenuOpen(false)}
              className="text-foreground"
            >
              <X size={24} />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <Input
              value={query}
              onChange={handleSearch}
              type="text"
              placeholder="Search jobs, companies..."
              className="w-full pl-4 border border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 rounded-md bg-background"
            />
            {user ? (
              <div className="space-y-2">
                <Link to="/profile">
                  <Button variant="ghost" className="w-full text-foreground">
                    Profile
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" className="w-full text-foreground">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/logout">
                  <Button variant="ghost" className="w-full text-foreground">
                    Logout
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login">
                  <Button variant="ghost" className="w-full text-foreground">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" className="w-full text-foreground">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;