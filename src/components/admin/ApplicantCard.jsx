import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit2, Eye, Mail, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ApplicantsCards = () => {
    const params = useParams();
    const applicationId = params.id;
    console.log("Application ID", applicationId);
    const { allApplicants } = useSelector((state) => state.application);

    console.log("allApplicants for application", allApplicants);

    const [filteredApplication, setFilteredApplication] = useState([]);

    useEffect(() => {
        if (allApplicants && applicationId) {
            const filtered = allApplicants.filter(applicant => applicant._id === applicationId);
            setFilteredApplication(filtered);
        } else {
            setFilteredApplication([]); // Reset if no ID is selected
        }
    }, [allApplicants, applicationId]);

    console.log("Filtered application", filteredApplication);

    return (
        <div className="max-w-5xl mx-auto my-6 max-h-full">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-100 my-4 underline underline-offset-1">
                Applicants Profile:-
            </h2>
            {filteredApplication.length > 0 ? (
                <div>
                    {filteredApplication.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                        >
                            <div className="relative w-full h-64">
                                {item?.applicant?.profile?.coverImage ? (
                                    <img
                                        src={item?.applicant?.profile?.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-14 h-14 text-gray-400 dark:text-gray-300"
                                        >
                                            <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                )}
                                {item?.applicant?.profile?.avatar && (
                                    <img
                                        src={item?.applicant?.profile?.avatar}
                                        alt="Avatar"
                                        className="absolute -bottom-8 left-8 w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                                    />
                                )}
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-thin px-4 py-1 rounded-bl-lg shadow-md">
                                    <p className="text-xs font-medium text-white">
                                        Applied on: {new Date(item?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 w-full flex flex-col">
                                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                                    {item?.applicant?.fullName}
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 text-base font-semibold font-serif">
                                    {item?.applicant?.profile?.bio}
                                </p>
                                <div className="mt-3">
                                    <h4 className="text-gray-700 dark:text-gray-400 font-semibold">Contact Information</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                        <div className="flex gap-2">
                                            <Mail className="w-5 h-5" />
                                            <span className="font-medium text-blue-600 dark:text-indigo-400">
                                                {item?.applicant?.email}
                                            </span>

                                        </div>
                                        <div className="flex gap-2">
                                            <Phone className="w-5 h-5" />
                                            <span className="font-medium text-blue-600 dark:text-indigo-400">{item?.applicant?.phoneNumber}</span>
                                        </div>
                                    </p>
                                </div>
                                <div className="mt-3 gap-2">
                                    <div className="text-gray-700 dark:text-gray-400 font-semibold">Skills</div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                        {item?.applicant?.profile?.skills?.length ? (
                                            item?.applicant?.profile?.skills?.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="px-3 py-1 mx-1 bg-black dark:bg-gray-700 text-white rounded-full"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400 dark:text-gray-500">No skills added yet.</span>
                                        )}
                                    </p>

                                </div>
                                <div className="mt-3">
                                    <h4 className="text-gray-700 dark:text-gray-400 font-semibold">  View Resume:</h4>
                                    {item?.applicant?.profile?.resume ? (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                            <Link
                                                to={`${item?.applicant?.profile?.resume}?fl_attachment=false`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </Link>
                                    </p>
                                        
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">Resume not available</span>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <h4 className="text-gray-700 dark:text-gray-400 font-semibold">Cover Letter</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                        {item?.applicant?.profile?.coverLetter ||
                                            "This is a placeholder cover letter. It highlights the applicant's goals and skills."}
                                    </p>
                                </div>
                                <div className="mt-3">
                                    <h4 className="text-gray-700 dark:text-gray-400 font-semibold">Additional Info</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            LinkedIn Profile
                                        </a>
                                        <br />
                                        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            GitHub Profile
                                        </a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center text-xl font-medium">No applicants found.</p>
            )}
        </div>
    );
};

export default ApplicantsCards;
