import React, { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LatestJobCard = ({
    title, company, location, logo, description, createdAt, jobType, salary, position, experience, _id, applications
}) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    
    // Initialize isApplied state based on whether user has already applied
    const [isApplied, setIsApplied] = useState(applications?.some(application => application.applicant === user?._id) || false);

    // Format the posted date to show relative time (e.g., "1 day ago", "Today")
    const formatDate = (date) => {
        const timeDiff = Math.floor((new Date() - new Date(date)) / (1000 * 3600 * 24));
        if (timeDiff < 1) return "Today";
        if (timeDiff === 1) return "1 day ago";
        return `${timeDiff} days ago`;
    };

    return (
        <div 
            onClick={() => navigate(`/jobDescription/${_id}`)}
            className="relative w-full h-full max-w-lg mx-auto bg-gradient-to-tr from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
            {/* Decorative Ribbon */}
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-thin px-4 py-1 rounded-bl-lg shadow-md">
                <p className="text-xs font-medium text-white">
                    Posted {formatDate(createdAt) || "Featured"}
                </p>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center flex-shrink-0">
                        <img src={company?.logo} alt={company?.companyName} className="object-cover h-full w-full rounded-full" />
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">{title || "NA"}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {company?.companyName || "Company Name"} • {location?.join(", ") || "Location not available"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 flex-1">
                    {description || "Job description not available"}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full">
                        {jobType || "Job Type not specified"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-medium rounded-full">
                        {salary ? `$${salary} per annum` : "Salary not disclosed"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs font-medium rounded-full">
                        {position ? `${position} positions` : "Positions not specified"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                        {experience ? `${experience}+ years of experience` : "Experience level not specified"}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {/* Removed buttons */}
            </div>
        </div>
    );
};

export default LatestJobCard;
