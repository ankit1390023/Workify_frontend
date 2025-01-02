import React from "react";

const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center rounded-lg z-50">
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
                {/* Circular Loader */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-t-indigo-500 border-b-indigo-300 border-l-indigo-300 border-r-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-t-indigo-300 border-b-indigo-500 border-l-transparent border-r-indigo-300 rounded-full animate-spin-slower"></div>
                </div>

                {/* Loading Message */}
                <span className="text-lg font-semibold text-indigo-600 animate-pulse">
                    {message}
                </span>
            </div>
        </div>
    );
};

export default Loader;
