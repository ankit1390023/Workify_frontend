import { useSelector } from 'react-redux';
import FilterCard from './filterCard';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import Chat from './ai/Chat';
import { Search, Briefcase, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const Jobs = () => {
  const { allJobs, searchQuery } = useSelector((state) => state.job);
  const [filterJob, setFilterJob] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of job opportunities with all the information you need. It's your future, come find it.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  className="pl-12 h-12 bg-background/50 text-foreground border-border/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>
              <Button
                variant="outline"
                className="gap-2 h-12 px-6 hover:bg-primary/5 transition-colors duration-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
                Filters
                {Object.keys(appliedFilters).length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                    {Object.keys(appliedFilters).length}
                  </Badge>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:w-1/4"
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FilterCard onFilterChange={handleFilterChange} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs List */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterJob.length > 0 ? (
                  filterJob.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <Job {...job} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full flex flex-col items-center justify-center py-16"
                  >
                    <div className="bg-primary/5 p-8 rounded-full mb-6">
                      <Briefcase className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">No jobs found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Try adjusting your search or filter criteria to find more jobs. You can also try different keywords or locations.
                    </p>
                  </motion.div>
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
