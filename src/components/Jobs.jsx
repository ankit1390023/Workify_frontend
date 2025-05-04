import { useSelector } from 'react-redux';
import FilterCard from './filterCard';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import Chat from './ai/Chat';

const Jobs = () => {
  const { allJobs, searchQuery } = useSelector((state) => state.job);
  const [filterJob, setFilterJob] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term) => {
    return term.toLowerCase().replace(/\s+/g, '');
  };

  useEffect(() => {
    const applyFilters = () => {
      let filteredJobs = [...allJobs];

      // Apply search query filter
      if (searchQuery) {
        const normalizedSearch = normalizeSearchTerm(searchQuery);
        filteredJobs = filteredJobs.filter((job) => {
          const normalizedTitle = normalizeSearchTerm(job.title);
          const normalizedCompany = normalizeSearchTerm(job.company.companyName);
          const normalizedJobType = normalizeSearchTerm(job.jobType);
          const normalizedLocations = job.location.map(loc => normalizeSearchTerm(loc));
          const normalizedRequirements = job.requirements.map(req => normalizeSearchTerm(req));

          return (
            normalizedTitle.includes(normalizedSearch) ||
            normalizedCompany.includes(normalizedSearch) ||
            normalizedJobType.includes(normalizedSearch) ||
            normalizedLocations.some(loc => loc.includes(normalizedSearch)) ||
            normalizedRequirements.some(req => req.includes(normalizedSearch))
          );
        });
      }

      // Apply all active filters
      Object.entries(appliedFilters).forEach(([filterType, filterValues]) => {
        if (filterValues && filterValues.length > 0) {
          switch (filterType) {
            case 'Location':
              filteredJobs = filteredJobs.filter((job) =>
                filterValues.some(location => job.location.includes(location))
              );
              break;
            case 'Industry':
              filteredJobs = filteredJobs.filter((job) =>
                filterValues.some(industry => 
                  normalizeSearchTerm(job.title).includes(normalizeSearchTerm(industry))
                )
              );
              break;
            case 'JobType':
              filteredJobs = filteredJobs.filter((job) => 
                filterValues.includes(job.jobType)
              );
              break;
            case 'Salary':
              const salaryRanges = filterValues.map(range => {
                const [min, max] = range.split('-').map((s) => parseInt(s.replace(/[^0-9]/g, '')) || 0);
                return { min, max };
              });
              filteredJobs = filteredJobs.filter((job) =>
                salaryRanges.some(({ min, max }) => 
                  job.salary >= min && (!max || job.salary <= max)
                )
              );
              break;
            case 'Experience':
              const experienceLevels = filterValues.map(exp => parseInt(exp.split('-')[0]) || 0);
              filteredJobs = filteredJobs.filter((job) => 
                experienceLevels.some(exp => job.experience >= exp)
              );
              break;
            case 'Technologies':
              filteredJobs = filteredJobs.filter((job) =>
                filterValues.some(tech => job.requirements.includes(tech))
              );
              break;
            case 'Work Environment':
              filteredJobs = filteredJobs.filter((job) => 
                filterValues.includes(job.workEnvironment)
              );
              break;
            case 'Posted Date':
              const now = new Date();
              const dateRanges = filterValues.map(range => {
                const daysAgo = {
                  'Last 24 Hours': 1,
                  'Last 7 Days': 7,
                  'Last 14 Days': 14,
                  'Last 30 Days': 30,
                  'Older': Infinity,
                }[range];
                return daysAgo;
              });
              filteredJobs = filteredJobs.filter((job) => {
                const postedDate = new Date(job.createdAt);
                const daysSincePosted = (now - postedDate) / (1000 * 60 * 60 * 24);
                return dateRanges.some(daysAgo => daysSincePosted <= daysAgo);
              });
              break;
          }
        }
      });

      setFilterJob(filteredJobs);
    };

    applyFilters();
  }, [allJobs, searchQuery, appliedFilters]);

  const handleFilterChange = (filterType, values) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      if (values === null || values.length === 0) {
        // Remove the filter if no values are selected
        delete newFilters[filterType];
      } else {
        // Update the filter with new values
        newFilters[filterType] = values;
      }
      return newFilters;
    });
  };

  return (
    <div>
      <Header />
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
                  filterJob.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="flex-shrink-0"
                      key={job._id}
                    >
                      <Job {...job} />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">No jobs found matching your criteria.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <Chat />
      <Footer />
    </div>
  );
};

export default Jobs;
