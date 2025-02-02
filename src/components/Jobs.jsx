import { useSelector } from 'react-redux';
import FilterCard from './filterCard';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Jobs = () => {
  const { allJobs, searchQuery } = useSelector((state) => state.job);
  const [filterJob, setFilterJob] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    const applyFilters = () => {
      let filteredJobs = allJobs;

      // Filter by Search Query
      if (searchQuery) {
        filteredJobs = filteredJobs.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.some((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase())) ||
          job.requirements.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Apply location filter
      if (appliedFilters.Location) {
        filteredJobs = filteredJobs.filter((job) =>
          job.location.some((loc) => loc === appliedFilters.Location)
        );
      }

      // Apply industry filter
      if (appliedFilters.Industry) {
        filteredJobs = filteredJobs.filter((job) =>
          job.title.toLowerCase() === appliedFilters.Industry.toLowerCase()
        );
      }

      // Apply salary filter
      if (appliedFilters.Salary) {
        const [min, max] = appliedFilters.Salary.split('-').map((s) => parseInt(s.replace(/[^0-9]/g, '')) || 0);
        filteredJobs = filteredJobs.filter((job) =>
          job.salary >= min && (!max || job.salary <= max)
        );
      }

      // Apply job type filter
      if (appliedFilters.JobType) {
        filteredJobs = filteredJobs.filter((job) => job.jobType === appliedFilters.JobType);
      }

      // Apply experience filter
      if (appliedFilters.Experience) {
        const exp = parseInt(appliedFilters.Experience.split('-')[0]) || 0;
        filteredJobs = filteredJobs.filter((job) => job.experience >= exp);
      }

      // Apply technologies filter
      if (appliedFilters.Technologies) {
        filteredJobs = filteredJobs.filter((job) =>
          job.requirements.includes(appliedFilters.Technologies)
        );
      }

      // Apply work environment filter
      if (appliedFilters['Work Environment']) {
        filteredJobs = filteredJobs.filter((job) => job.workEnvironment === appliedFilters['Work Environment']);
      }

      // Apply posted date filter
      if (appliedFilters['Posted Date']) {
        const now = new Date();
        const daysAgo = {
          'Last 24 Hours': 1,
          'Last 7 Days': 7,
          'Last 14 Days': 14,
          'Last 30 Days': 30,
          Older: Infinity,
        }[appliedFilters['Posted Date']];
        filteredJobs = filteredJobs.filter((job) => {
          const postedDate = new Date(job.createdAt);
          return (now - postedDate) / (1000 * 60 * 60 * 24) <= daysAgo;
        });
      }

      setFilterJob(filteredJobs);
    };

    applyFilters();
  }, [allJobs, searchQuery, appliedFilters]);

  const handleFilterChange = (filterType, value) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Filter Section */}
        <div className="w-full lg:w-1/4 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <FilterCard onFilterChange={handleFilterChange} />
        </div>

        {/* Jobs List */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-2.5rem)] pr-4">
            <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterJob.length > 0 ? (
                filterJob.map((job) =>
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-shrink-0"
                    as={motion.div}
                    key={job._id}>
                    <Job  {...job} />
                  </motion.div>
                 )
              ) : (
                <p className="text-gray-500 text-center col-span-full">No jobs found.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
