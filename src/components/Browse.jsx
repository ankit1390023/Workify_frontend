import React from 'react';
import { useSelector } from 'react-redux';
import Job from './Job';
import { ScrollArea } from './ui/scroll-area';

const Browse = () => {
  const { allJobs, searchQuery, isLoading } = useSelector(state => state.job);

  const filteredJobs = allJobs.filter(job =>
    job.title.match(new RegExp(searchQuery, 'gi')) ||
    job.company.companyName.match(new RegExp(searchQuery, 'gi')) ||
    job.jobType.match(new RegExp(searchQuery, 'gi'))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-blue-500 dark:bg-blue-700 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Find Your Dream Job</h1>
          <p className="mt-2 text-lg">
            Explore thousands of opportunities and take the next step in your career.
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
              Search Results ({filteredJobs.length})
            </h3>
            <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <Job key={index} {...job} />
                  ))
                ) : (
                  <div className="col-span-full text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No jobs found matching your criteria. Try refining your search.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </section>
        )}
      </main>

     
    </div>
  );
};

export default Browse;
