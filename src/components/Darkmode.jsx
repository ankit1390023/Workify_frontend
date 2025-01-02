import React, { useEffect, useState } from 'react';

function Darkmode() {
    const [isDarkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className='min-h-screen bg-white dark:bg-gray-800'>
            <button onClick={toggleDarkMode}   className='dark:text-white text-blue-500'>
                Toggle Dark Mode
            </button>
        </div>
    );
}

export default Darkmode;
