import React from 'react';
import useGetAllApplicants from '../hooks/useGetApplicants';
import { useParams } from 'react-router-dom';
import ApplicantsTable from './ApplicantsTable';

const Applicants = () => {
    const params = useParams();
    const jobId = params.id;
    console.log("jobId: " + jobId);
    useGetAllApplicants(jobId);
    return (
        <div className="p-10 max-w-5xl mx-auto bg-white rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                Applicants Overview
            </h1>
           <ApplicantsTable/>
        </div>
    );
};
export default Applicants;
