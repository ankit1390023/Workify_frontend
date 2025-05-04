import React from 'react';
import useGetAllApplicants from '../hooks/useGetApplicants';
import { useParams } from 'react-router-dom';
import ApplicantsTable from './ApplicantsTable';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { useTheme } from '@/context/ThemeContext';

const Applicants = () => {
    const params = useParams();
    const { theme } = useTheme();
    const jobId = params.id;
    console.log("jobId: " + jobId);
    useGetAllApplicants(jobId);
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="p-10 max-w-5xl mx-auto bg-background rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg">
                <h1 className="text-3xl font-semibold text-foreground mb-8 text-center">
                    Applicants Overview
                </h1>
                <ApplicantsTable/>
            </div>
            <Footer/>
        </div>
    );
};
export default Applicants;
