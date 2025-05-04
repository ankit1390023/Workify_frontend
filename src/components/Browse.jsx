import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';
import { setSearchQuery, setCategoryFilter } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

import Footer from './shared/Footer';
import Header from './shared/Header';
import Chat from './ai/Chat';

// Define categories here to match the ones in CategoryCarousel
const categories = [
    {
        name: "Software Development",
        keywords: ["software", "developer", "programming", "coding", "engineer", "development", "software engineer", "software developer"]
    },
    {
        name: "Data Science",
        keywords: ["data", "analyst", "machine learning", "ai", "data science", "data scientist", "ml", "artificial intelligence"]
    },
    {
        name: "Web Development",
        keywords: ["web", "frontend", "backend", "fullstack", "web developer", "front-end", "back-end", "full stack"]
    },
    {
        name: "DevOps",
        keywords: ["devops", "cloud", "infrastructure", "deployment", "ci/cd", "continuous integration", "continuous deployment"]
    },
    {
        name: "React Native",
        keywords: ["react", "mobile", "app", "react native", "react-native", "mobile developer", "mobile app"]
    },
    {
        name: "MERN Stack",
        keywords: ["mern", "mongodb", "express", "react", "node", "node.js", "express.js", "mongo"]
    },
    {
        name: "Cloud Computing",
        keywords: ["cloud", "aws", "azure", "gcp", "google cloud", "amazon web services", "microsoft azure"]
    },
];

const Browse = () => {
  const dispatch = useDispatch();
  const { allJobs, searchQuery, categoryFilter, isLoading } = useSelector(state => state.job);

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term) => {
    if (!term) return '';
    return term.toLowerCase().replace(/\s+/g, '');
  };

  // Helper function to check if a job matches any of the keywords
  const matchesKeywords = (text, keywords) => {
    if (!text) return false;
    const normalizedText = normalizeSearchTerm(text);
    return keywords.some(keyword => {
      const normalizedKeyword = normalizeSearchTerm(keyword);
      return normalizedText.includes(normalizedKeyword);
    });
  };

  // Filter jobs based on search query and category
  const filteredJobs = allJobs.filter(job => {
    // If there's a category filter, only show jobs from that category
    if (categoryFilter) {
      const category = categories.find(cat => cat.name === categoryFilter);
      if (!category) return false;
      
      // Check if job matches any of the category keywords in any field
      const matchesTitle = matchesKeywords(job.title, category.keywords);
      const matchesDescription = matchesKeywords(job.description, category.keywords);
      const matchesRequirements = job.requirements && job.requirements.some(req => matchesKeywords(req, category.keywords));
      const matchesJobType = matchesKeywords(job.jobType, category.keywords);

      const matches = matchesTitle || matchesDescription || matchesRequirements || matchesJobType;
      
      // Debug log to see which jobs are being shown
      if (matches) {
        console.log(`Job shown in Browse for ${categoryFilter}:`, job.title);
      }
      
      return matches;
    }
    
    // If there's a search query, filter by it
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      return searchTerms.some(term => 
        normalizeSearchTerm(job.title).includes(normalizeSearchTerm(term)) ||
        normalizeSearchTerm(job.company.companyName).includes(normalizeSearchTerm(term)) ||
        normalizeSearchTerm(job.jobType).includes(normalizeSearchTerm(term)) ||
        job.location.some(loc => normalizeSearchTerm(loc).includes(normalizeSearchTerm(term))) ||
        job.requirements.some(req => normalizeSearchTerm(req).includes(normalizeSearchTerm(term)))
      );
    }
    
    return true;
  });

  // Debug log to see total jobs
  console.log(`Total jobs in Browse for ${categoryFilter || 'all'}:`, filteredJobs.length);

  // Cleanup function to reset search query and category filter when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''));
      dispatch(setCategoryFilter(''));
    };
  }, [dispatch]);

  return (
    <div>
      <Header/>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="bg-blue-500 dark:bg-blue-700 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold">Find Your Dream Job</h1>
            <p className="mt-2 text-lg">
              {categoryFilter 
                ? `Showing ${categoryFilter} Jobs`
                : searchQuery 
                  ? `Searching for: ${searchQuery}`
                  : 'Explore thousands of opportunities and take the next step in your career.'}
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <section>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {categoryFilter 
                  ? `${categoryFilter} Jobs`
                  : searchQuery 
                    ? 'Search Results'
                    : 'All Jobs'} ({filteredJobs.length})
              </h3>
              <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                      <motion.div 
                        key={job._id}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative"
                      >
                        <Job {...job} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {categoryFilter 
                          ? `No ${categoryFilter} jobs available at the moment.`
                          : searchQuery 
                            ? 'No jobs found matching your search criteria. Try different keywords.'
                            : 'No jobs available at the moment.'}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </section>
          )}
        </main>
        <Chat />
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
