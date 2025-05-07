import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LatestJobsCard from './LatestJobsCard';
import { motion } from 'framer-motion';
import CategoryCarousel from './CategoryCarousel';
import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const LatestJobs = () => {
    const dispatch = useDispatch();
    const allJobs = useSelector((state) => state.job.allJobs || []);
    const { user } = useSelector(store => store.auth);
    console.log("allJobs",allJobs);
    // Fetch jobs with applications data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_END_POINT}/job/getAllJobs`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.data.success) {
                    // Ensure each job has an applications array
                    const jobsWithApplications = response.data.data.map(job => ({
                        ...job,
                        applications: job.applications || []
                    }));
                    dispatch(setAllJobs(jobsWithApplications));
                } else {
                    toast.error('Failed to fetch jobs');
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('An error occurred while fetching jobs');
            }
        };

        fetchJobs();
    }, [dispatch, user?._id]); // Add user._id as dependency to refetch when user changes

    return (
        <div className="bg-background py-16 space-y-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -50, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center space-y-4"
            >
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Latest & Top <span className="text-primary">Job Openings</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover exciting career opportunities from leading companies
                </p>
            </motion.div>

            {/* Category Carousel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
            >
                <CategoryCarousel />
            </motion.div>

            {/* Jobs Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 lg:px-16">
                    {allJobs.length <= 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12"
                        >
                            <p className="text-xl text-muted-foreground">No jobs available at the moment</p>
                        </motion.div>
                    ) : (
                        allJobs.slice(0, 9).map((job, index) => (
                            <motion.div
                                key={job._id || index}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="transition-all duration-300"
                            >
                                <LatestJobsCard job={job} />
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LatestJobs;