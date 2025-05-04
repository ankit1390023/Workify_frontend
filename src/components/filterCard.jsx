import React from 'react';
import { Label } from './ui/label';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { motion } from 'framer-motion';

const filterData = [
    {
        filterType: 'Location',
        array: ['Noida', 'Kanpur', 'Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'],
    },
    {
        filterType: 'Industry',
        array: [
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Cloud Computing',
            'Data Scientist',
            'Quality Assistance',
            'React Native Developer',
            'AI/ML Engineer',
            'Cybersecurity Specialist',
            'Software Engineer',
            'DevOps Engineer',
        ],
    },
    {
        filterType: 'JobType',
        array: ['Part-Time', 'Full-Time', 'Internship', 'Contract', 'Remote'],
    },
];

const FilterCard = ({ onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({});

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (!newFilters[filterType]) {
                newFilters[filterType] = [];
            }
            
            if (newFilters[filterType].includes(value)) {
                // Remove the value if it's already selected
                newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
                if (newFilters[filterType].length === 0) {
                    delete newFilters[filterType];
                }
            } else {
                // Add the value if it's not selected
                newFilters[filterType] = [...newFilters[filterType], value];
            }
            
            // Notify parent component of the change
            onFilterChange(filterType, newFilters[filterType] || null);
            return newFilters;
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'
        >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Filter Jobs</h1>
            <hr className="border-gray-200 dark:border-gray-700 mb-6" />

            {/* Filter Options */}
            {filterData.map((filter) => (
                <div key={filter.filterType} className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {filter.filterType}
                    </h2>
                    <div className="space-y-2">
                        {filter.array.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${filter.filterType}-${option}`}
                                    checked={selectedFilters[filter.filterType]?.includes(option) || false}
                                    onCheckedChange={() => handleFilterChange(filter.filterType, option)}
                                />
                                <Label htmlFor={`${filter.filterType}-${option}`} className="text-gray-700 dark:text-gray-300">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

export default FilterCard;
