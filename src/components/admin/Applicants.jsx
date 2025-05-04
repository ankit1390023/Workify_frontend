import React from 'react';
import useGetAllApplicants from '../hooks/useGetApplicants';
import { useParams } from 'react-router-dom';
import ApplicantsTable from './ApplicantsTable';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { useTheme } from '@/context/ThemeContext';
import { Users } from 'lucide-react';

const Applicants = () => {
    const params = useParams();
    const { theme } = useTheme();
    const jobId = params.id;
    console.log("jobId: " + jobId);
    useGetAllApplicants(jobId);

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary" />
                            <h1 className="text-3xl font-bold text-foreground">
                                Applicants Overview
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            View and manage all applicants for this job posting
                        </p>
                    </div>

                    {/* Table Section */}
                    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                        <ApplicantsTable/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Applicants;
