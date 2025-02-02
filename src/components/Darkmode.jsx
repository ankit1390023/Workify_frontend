import { Moon, Sun } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

const Darkmode = ({ darkMode, setDarkMode }) => {
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        // Check for dark mode preference in local storage on component mount
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, [setDarkMode]);

    return (
     
         <Button
            variant="ghost"
            aria-label="Toggle Dark Mode"
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </Button>
    );
};

export default Darkmode;
