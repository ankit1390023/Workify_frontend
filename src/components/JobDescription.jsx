import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setSingleJob } from '@/redux/jobSlice';
import Header from './shared/Header';
import Footer from './shared/Footer';
import Chat from './ai/Chat';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

// Loading Animation Component
const LoadingAnimation = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg font-semibold text-primary animate-pulse">
                Loading job details...
            </span>
        </div>
    </div>
);

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const SingleJob = useSelector((state) => state.job.singleJob);
    const {
        title,
        company,
        jobType,
        location,
        experience,
        salary,
        description,
        requirements,
        position,
        preferredSkills,
        benefits,
        applicationProcess,
        createdAt,
        updatedAt,
    } = SingleJob;
    const postedDate = new Date(createdAt).toLocaleDateString();
    const updatedDate = new Date(updatedAt).toLocaleDateString();
    const { user } = useSelector(store => store.auth);
    // console.log("userID is", user?._id);
    const isInitiallyApplied = SingleJob?.applications?.some(application => application.applicant === user?.
        _id) || false;    //.some() ,true ya false return krta h,ydi exist krta h
    console.log("isInitiallyApplied", SingleJob?.applications?.some(application => application.applicant === user?.
        _id));
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const applyJobHandler = async () => {
        try {
            const response = await axios.get(`${API_END_POINT}/application/applyJob/${jobId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );

            if (response.data.success) {
                // Update the local state to reflect the application status
                setIsApplied(true);

                // Update the UI with the new application count
                const updatedSingleJob = {
                    ...SingleJob,
                    applications: [...SingleJob.applications, { applicant: user?._id }],
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success('Application submitted successfully!');
            } else {
                toast.error(`Unable to apply: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error applying for the job:', error);
            toast.error(error?.response?.data?.message || error.message || "An error occurred while submitting your application. Please try again.");
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_END_POINT}/job/getJobById/${jobId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
                        }
                    });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.data));
                    setIsApplied(res?.data?.data?.applications.some(application => application?.applicant === user?._id));
                    console.log("this is  somtrhing", res?.data?.data?.applications.some(application => application?.applicant === user?._id))
                    // console.log("this is not somtrhing", res?.data?.data?.applications);
                    toast.success('Job description fetched successfully.');
                } else {
                    toast.error(`Failed to fetch job description: ${res.data.message}`);
                }
            } catch (error) {
                console.error('Error fetching job description:', error.message);
                toast.error('An error occurred while fetching the job description.');
            } finally {
                setLoading(false);
            }
        };
        fetchSingleJob();
    }, [dispatch, jobId, user?._id]);

    if (loading) {
        return (
            <>
                <Header />
                <LoadingAnimation />
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-semibold text-destructive">Error Loading Job</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div>
            <Header />
            <main className="py-16 px-6 text-gray-800 dark:text-gray-100">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="space-y-4 pb-6 border-b border-gray-300 dark:border-gray-700 md:flex md:items-center md:justify-between">
                        <div className="flex gap-6">
                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                                <img
                                    src={company?.logo || 'https://via.placeholder.com/150'}
                                    alt={company?.companyName || 'Company Logo'}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title || 'Job Title'}</h1>
                                <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
                                    {`@ ${company?.companyName || 'Company Name'}`}
                                </p>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-200 text-xs font-medium rounded-full">
                                        {jobType || 'Job Type not specified'}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-700 text-orange-600 dark:text-orange-200 text-xs font-medium rounded-full">
                                        {location?.join(", ") || 'Location not specified'}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-700 text-green-600 dark:text-green-200 text-xs font-medium rounded-full">
                                        {salary ? `$${salary} per annum` : 'Salary not disclosed'}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-purple-200 text-xs font-medium rounded-full">
                                        {position ? `${position} positions` : 'Positions not specified'}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-200 text-xs font-medium rounded-full">
                                        {experience ? `${experience}+ years of experience` : 'Experience level not specified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={isApplied ? null : applyJobHandler}
                            className={`px-5 py-2 rounded-lg shadow-lg  
        ${isApplied ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 transition-transform transform hover:scale-105 text-white hover:bg-blue-700'}`}
                            disabled={isApplied} // Disable the button if already applied
                        >
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </button>

                    </header>

                    {/* Job Description */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
                        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{description || 'No description available for this job.'}</p>
                    </section>

                    {/* About Company */}
                    <section className="border-b pb-4 border-gray-300 dark:border-gray-700">
                        <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <ul className="space-y-2">
                                {company?.location && (
                                    <li>
                                        <span className="font-semibold text-gray-900 dark:text-white">Location: </span>
                                        {company.location}
                                    </li>
                                )}
                                {salary && (
                                    <li>
                                        <span className="font-semibold text-gray-900 dark:text-white">Salary: </span>
                                        ${salary} per annum
                                    </li>
                                )}
                                {jobType && (
                                    <li>
                                        <span className="font-semibold text-gray-900 dark:text-white">Job Type: </span>
                                        {jobType}
                                    </li>
                                )}
                                {experience && (
                                    <li>
                                        <span className="font-semibold text-gray-900 dark:text-white">Experience Required: </span>
                                        {experience}+ years
                                    </li>
                                )}
                                {position && (
                                    <li>
                                        <span className="font-semibold text-gray-900 dark:text-white">Positions Available: </span>
                                        {position}
                                    </li>
                                )}
                                {/* Job Dates and Applicants */}
                                <div className="space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <p><strong>Posted On:</strong> {postedDate}</p>
                                    <p><strong>Last Updated:</strong> {updatedDate}</p>
                                    <p><strong>Number of Applicants:</strong> {SingleJob?.applications?.length}</p>
                                </div>
                            </ul>
                        </div>
                    </section>

                    {/* Required Skills */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Required Skills</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            {(requirements && requirements.length > 0
                                ? requirements
                                : ['Skill 1', 'Skill 2', 'Skill 3']
                            ).map((skill, idx) => (
                                <li key={idx}>{skill}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Benefits */}
                    <section className="space-y-4 border-b pb-6 border-gray-300 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Benefits</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                            {(benefits && benefits.length > 0
                                ? benefits
                                : ['Flexible working hours', 'Comprehensive health insurance', 'Generous paid time off']
                            ).map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Application Process */}
                    <section className="space-y-4 border-b pb-6 border-gray-300 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How to Apply</h2>
                        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                            {applicationProcess ||
                                `Step 1: Submit your application through our portal.
Step 2: Include a detailed resume and a personalized cover letter.
Step 3: Await confirmation for the next steps.
Step 4: Participate in a technical interview.
Step 5: Finalize discussions with our team.`}
                        </p>
                    </section>

                    {/* Company Description */}
                    <section className="space-y-4 border-b pb-6 border-gray-300 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About the Company</h2>
                        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                            {company?.description ||
                                `Our company is a leading force in its industry, renowned for innovation, excellence, and integrity. With a strong commitment to delivering exceptional products and services, we have established a global presence, operating in over 20 countries with a dedicated workforce of 10,000+ employees. Our mission is to empower businesses and individuals by providing cutting-edge solutions that drive success and foster growth.`}
                        </p>
                    </section>
                </div>
               
            </main>
            <Chat/>
            <Footer />
        </div>
    );
};

export default JobDescription;
