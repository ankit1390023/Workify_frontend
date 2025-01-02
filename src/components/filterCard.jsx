import { useState } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';  // Assuming you have a custom Label component
import { Input } from './ui/input';  // Assuming you have a custom Input component


const jobTypes = ['Full-Time', 'Part-Time', 'Contract'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];
const locations = ['New York', 'San Francisco', 'London', 'Remote'];

export default function FilterSection({randomJobs, onFilterChange}) {
    const [location, setLocation] = useState('');
    const [salaryRange, setSalaryRange] = useState([0, 200000]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedExpTypes, setSelectedExpTypes] = useState([]);


    const handleLocationChange = (e) => {
        const locationValue = e.target.value;
        setLocation(locationValue);
        filterJobsByLocation(locationValue);  // Call the filtering function on location change
    };

    const filterJobsByLocation = (locationValue) => {
        const updatedFilteredJobs = randomJobs.filter((job) => {
            // Check if the location contains the input value (case insensitive)
            return job.location.toLowerCase().includes(locationValue.toLowerCase());
        });
    
        // Pass the filtered jobs to the parent component
        onFilterChange(updatedFilteredJobs);
    };
    // Handle salary range change
    const handleSliderChange = (newRange) => {
        setSalaryRange(newRange);
        filterJobs(newRange, selectedJobTypes, selectedExpTypes);
    };

    // Handle job type checkbox change
    const handleCheckboxChange = (jobType) => {
        setSelectedJobTypes((prevSelectedJobTypes) => {
            const newSelectedJobTypes = prevSelectedJobTypes.includes(jobType)
                ? prevSelectedJobTypes.filter((type) => type !== jobType)
                : [...prevSelectedJobTypes, jobType];
            
            // Filter jobs based on all selected filters
            filterJobs(salaryRange, newSelectedJobTypes, selectedExpTypes);

            return newSelectedJobTypes;
        });
    };

    // Handle experience level checkbox change
    const handleExperienceLevels = (level) => {
        setSelectedExpTypes((prevSelectedExpTypes) => {
            const newSelectedExpTypes = prevSelectedExpTypes.includes(level)
                ? prevSelectedExpTypes.filter((type) => type !== level)
                : [...prevSelectedExpTypes, level];
            
            // Filter jobs based on all selected filters
            filterJobs(salaryRange, selectedJobTypes, newSelectedExpTypes);

            return newSelectedExpTypes;
        });
    };

    // Function to filter jobs based on all criteria (salary, job type, and experience level)
    const filterJobs = (salaryRange, selectedJobTypes, selectedExpTypes) => {
        const updatedFilteredJobs = randomJobs.filter((job) => {
            const isSalaryInRange =
                job.salary[1] >= salaryRange[0] && job.salary[0] <= salaryRange[1];
            
            const isJobTypeValid =
                selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType);
            
            const isExperienceValid =
                selectedExpTypes.length === 0 || selectedExpTypes.includes(job.experienceLevel);

            // Return jobs that match all the filters (salary, job type, and experience level)
            return isSalaryInRange && isJobTypeValid && isExperienceValid;
        });

        // Pass the filtered jobs to the parent component
        onFilterChange(updatedFilteredJobs);
    };
    
    
    
    return (
        <div className="p-6 space-y-6 bg-white dark:bg-black rounded-lg shadow-sm">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">Job-Type</h3>
            <div className="space-y-2">
                {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={`type-${type}`}
                            checked={selectedJobTypes.includes(type)}
                            onChange={() => handleCheckboxChange(type)}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 dark:border-gray-600"
                        />
                        <label
                            htmlFor={`type-${type}`}
                            className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-none"
                        >
                            {type}
                        </label>
                    </div>
                ))}
            </div>

            
            {/* Salary Range Filter */}
            <div className="mb-6">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">
                    Salary Range
                </h3>
                <label className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 block">
                    Select Salary Range ($ per year)
                </label>

                {/* Slider Component */}
                <Slider
                    value={salaryRange}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={2000000}
                    step={10000}
                    className="w-full mt-2 h-2 bg-gray-200 rounded-lg dark:bg-gray-600" // Adjust height and background color
                    trackClassName="bg-blue-500" // Custom track color for visibility
                    thumbClassName="h-4 w-4 bg-blue-500 rounded-full" // Thumb styling
                />
                <div className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                    ${(salaryRange[0] / 1000).toFixed(0)}k - $
                    {(salaryRange[1] / 1000).toFixed(0)}k
                </div>
            </div>


            {/* Experience Level Section */}
            <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">Experience Level</h3>
                <div className="space-y-2">
                {experienceLevels.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={`type-${type}`}
                            checked={selectedExpTypes.includes(type)}
                            onChange={() => handleExperienceLevels(type)}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 dark:border-gray-600"
                        />
                        <label
                            htmlFor={`type-${type}`}
                            className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-none"
                        >
                            {type}
                        </label>
                    </div>
                ))}
            </div>
            </div>

            {/* Location Section */}
            <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">Location</h3>
                {/* Text Input for Location */}
                <label className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Enter Location</label>
                <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300 p-2 rounded-md"
                />
            </div>
        </div>
    );
}
