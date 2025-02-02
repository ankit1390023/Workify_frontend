import React, { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '@/redux/jobSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
    // {
    //     filterType: 'Salary',
    //     array: ['0-40k', '40k-1 Lakh', '1 Lakh to 5 Lakh', '5 Lakh to 10 Lakh', 'Above 10 Lakh'],
    // },
    {
        filterType: 'JobType',
        array: ['Part-Time', 'Full-Time', 'Internship', 'Contract', 'Remote'],
    },
    // {
    //     filterType: 'Experience',
    //     array: ['Fresher', '0-2 Years', '3-5 Years', '6-10 Years', 'Above 10 Years'],
    // },
    // {
    //     filterType: 'Technologies',
    //     array: [
    //         'JavaScript',
    //         'Python',
    //         'Java',
    //         'C++',
    //         'React',
    //         'Node.js',
    //         'Angular',
    //         'MongoDB',
    //         'MySQL',
    //         'AWS',
    //         'Docker',
    //         'Kubernetes',
    //     ],
    // },
    // {
    //     filterType: 'Work Environment',
    //     array: ['On-Site', 'Remote', 'Hybrid'],
    // },
    // {
    //     filterType: 'Posted Date',
    //     array: ['Last 24 Hours', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Older'],
    // },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const [query, setQuery] = useState("");
    // Search company by text
    const searchJobHandler = () => {
        console.log("searchJobHandler");
        dispatch(setSearchQuery(query));
        navigate("/browse");
    };

    const changeHandler = (value) => {
    setSelectedValue(value);
    }
    useEffect(() => {
      dispatch(setSearchQuery(selectedValue))
    }, [selectedValue]);
    return (
        <div className='w-full bg-white p-2 rounded-full'>
            <h1>Filter Jobs</h1>
            <hr className="mt-3" />
            <RadioGroup defaultValue="comfortable" value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <Label className="text-lg font-bold">{data.filterType}</Label>
                        {data.array.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2 my-2">
                                <RadioGroupItem value={item} id={`r${index}-${idx}`} />
                                <Label htmlFor={`r${index}-${idx}`}>{item}</Label>
                            </div>
                        ))}
                    </div>
                ))}
            </RadioGroup>

                   {/* Search Bar */}
                    <div className="md:hidden flex items-center w-full my-5">
                      <Input
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        placeholder="Search jobs, companies..."
                        className="w-full pl-4 border border-gray-800 dark:border-gray-600 focus:border-blue-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      />
                      <Button
                     onClick={searchJobHandler}
                        variant="default"
                        className="ml-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        Search
                      </Button>
                    </div>
        </div>
    );
};

export default FilterCard;
