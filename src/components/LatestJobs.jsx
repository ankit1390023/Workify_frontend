import React from 'react';
import { useSelector } from 'react-redux';
import LatestJobsCard from './LatestJobsCard';

const LatestJobs = () => {
    const allJobs = useSelector((state) => state.job.allJobs || []);

    return (
        <div className="bg-white dark:bg-gray-800 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
                Latest & Top <span className="text-blue-700">Job Openings</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
                {allJobs.length<=0?<span>No Jobs Available</span>:allJobs.slice(0, 9).map((job, index) =>(<LatestJobsCard key={job._id||index} job={job} />))}
            </div>
        </div>
    );
};

export default LatestJobs;
