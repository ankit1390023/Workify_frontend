import React from 'react';
import { useSelector } from 'react-redux';
import LatestJobsCard from './LatestJobsCard';
import { motion } from 'framer-motion';
import CategoryCarousel from './CategoryCarousel';

const LatestJobs = () => {
    const allJobs = useSelector((state) => state.job.allJobs || []);

    return (
        <div className="bg-white dark:bg-gray-800 py-12 space-y-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
                Latest & Top <span className="text-blue-700">Job Openings</span>
            </h2>
            <div><CategoryCarousel/></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
                {allJobs.length <= 0 ? <span>No Jobs Available</span> : allJobs.slice(0, 9).map((job, index) => (
                    <motion.div key={job._id || index}
                        initial={{ opacity: 0 ,y:100}}
                        animate={{ opacity: 1,y:0 }}
                        transition={{ duration: 0.5 }}

                    >
                        <LatestJobsCard job={job} />
                    </motion.div>
                 
                ))}
            </div>
        </div>
    );
};

export default LatestJobs;
