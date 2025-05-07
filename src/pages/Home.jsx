import React from 'react';
import { useDashboardData } from '../components/hooks/useDashboardData';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
    const { stats } = useSelector((state) => state.dashboard);
    const { loading, error } = useDashboardData();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Find Your Dream Job
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Connect with top companies and land your perfect role
                    </p>
                    {/* Add your hero section content */}
                </div>
            </section>

            {/* Dashboard Stats Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Your Job Search Progress
                    </h2>
                    
                    {loading ? (
                        <div className="text-center py-10 text-lg text-gray-500">
                            Loading your stats...
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardHeader>
                                    <CardTitle>Total Jobs Applied</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">
                                        {stats.totalAppliedJobs}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <CardHeader>
                                    <CardTitle>Interviews Scheduled</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">
                                        {stats.totalInterviews}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                                <CardHeader>
                                    <CardTitle>Pending Applications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">
                                        {stats.totalPending}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <CardHeader>
                                    <CardTitle>Profile Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">
                                        {stats.profileScore}%
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Rest of your home page content */}
        </div>
    );
} 