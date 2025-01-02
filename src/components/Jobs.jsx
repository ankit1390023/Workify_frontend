import { useSelector } from 'react-redux';
import FilterCard from './filterCard';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

const Jobs = () => {
  const allJobs = useSelector((state) => state.job.allJobs || []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Filter Section */}
        <div className="w-full lg:w-1/4 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <FilterCard />
        </div>

        {/* Jobs List */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-2.5rem)] pr-4">
            <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allJobs.map((job, index) => (
                <Job key={index} {...job} />
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
};

export default Jobs;
