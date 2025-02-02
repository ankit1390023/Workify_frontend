import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const LatestJobCard = ({ job }) => {
    const naviagate = useNavigate();
    const { title, description, salary, location, jobType, experience, position, company, _id, createdAt } = job;
    // console.log("job from latestJob card is ", job);
    // Format the posted date to show relative time (e.g., "1 day ago", "Today")
    const formatDate = (date) => {
        const timeDiff = Math.floor((new Date() - new Date(date)) / (24*60*60*1000));
        if (timeDiff < 1) return "Today";
        if (timeDiff === 1) return "1 day ago";
        return `${timeDiff} days ago`;
    };

    return (
        <div
            onClick={() => naviagate(`/jobDescription/${_id}`)}
            className="relative max-w-lg mx-autoz bg-gradient-to-tr from-white to-gray-50 shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            {/* Decorative Ribbon */}
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-thin px-4 py-1 rounded-bl-lg shadow-md">
                <p className="text-xs font-medium text-white">
                    Posted :{formatDate(createdAt) || "Featured"}
                </p>
            </div>


            {/* Card Content */}
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <img src={company?.logo} alt={company?.companyName} className="object-cover h-full w-full rounded-full" />
                    </div>


                    {/* Job Info */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{title || "NA"}</h2>
                        <p className="text-sm text-gray-500">
                            {company?.companyName || "Company Name"} 
                        </p>
                        <p className="text-sm text-gray-500">
                          {location?.join(", ") || "Location not available"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description || "Job description not available"}
                </p>

         
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {jobType || "Job Type not specified"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        {salary ? `$${salary} per annum` : "Salary not disclosed"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                        {position ? `${position} positions` : "Positions not specified"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {experience ? `${experience}+ years of experience` : "Experience level not specified"}
                    </span>
                </div>
            </div>

           
        </div>
    );
};

export default LatestJobCard;
