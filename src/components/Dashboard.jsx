import React from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useDashboardData } from './hooks/useDashboardData';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Radar, Pie, PolarArea } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler
);

export default function Dashboard() {
    const { user } = useSelector((state) => state.auth);
    const { stats, trends, skills } = useSelector((state) => state.dashboard);
    const { loading, error } = useDashboardData();

    // Chart data for job distribution pie chart
    const jobDistributionData = {
        labels: [
            'Total Jobs',
            'Applied Jobs',
            'Pending',
            'Interviews',
            'Rejected',
            'Selected'
        ],
        datasets: [
            {
                data: [
                    stats.totalJobs,
                    stats.totalAppliedJobs,
                    stats.totalPending,
                    stats.totalInterviews,
                    stats.totalRejected,
                    stats.totalSelected
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 75, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 75, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart data for application trends
    const applicationTrendsData = {
        labels: trends.map(trend => trend.month),
        datasets: [
            {
                label: 'Applications',
                data: trends.map(trend => trend.count),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Chart data for skills analysis
    const skillsData = {
        labels: skills.map(skill => skill.name),
        datasets: [
            {
                label: 'Skill Level',
                data: skills.map(skill => skill.level),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }
        ]
    };

    // Chart data for application status
    const applicationStatusData = {
        labels: ['Applied', 'Interviews', 'Pending', 'Rejected', 'Selected'],
        datasets: [
            {
                label: 'Applications',
                data: [
                    stats.totalAppliedJobs,
                    stats.totalInterviews,
                    stats.totalPending,
                    stats.totalRejected,
                    stats.totalSelected
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 75, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 75, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart data for profile score
    const profileScoreData = {
        labels: ['Profile Score'],
        datasets: [
            {
                data: [stats.profileScore, 100 - stats.profileScore],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart data for polar area chart
    const polarAreaData = {
        labels: skills.map(skill => skill.name),
        datasets: [
            {
                data: skills.map(skill => skill.level),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart options for application status
    const applicationStatusOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Application Status Overview',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    // Chart options for profile score
    const profileScoreOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Profile Completion Score',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        cutout: '70%'
    };

    // Chart options for application trends
    const applicationTrendsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Application Trends',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Chart options for skills analysis
    const skillsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Skills Analysis',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        }
    };

    // Chart options for job distribution
    const jobDistributionOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Job Application Distribution',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    // Chart options for polar area
    const polarAreaOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Skills Distribution',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {user?.fullName || 'User'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-lg text-muted-foreground">
                            Loading your stats...
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Total Jobs Available</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalJobs}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Total Applied Jobs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalAppliedJobs}
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
                                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Success Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalAppliedJobs > 0 
                                                ? Math.round((stats.totalSelected / stats.totalAppliedJobs) * 100) 
                                                : 0}%
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <Bar data={applicationStatusData} options={applicationStatusOptions} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <Line data={applicationTrendsData} options={applicationTrendsOptions} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Skills and Profile Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <Radar data={skillsData} options={skillsOptions} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <PolarArea data={polarAreaData} options={polarAreaOptions} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <Doughnut data={profileScoreData} options={profileScoreOptions} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Distribution Section */}
                            <div className="mt-8">
                                <Card>
                                    <CardContent className="p-6 h-[400px]">
                                        <Pie data={jobDistributionData} options={jobDistributionOptions} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Status Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                                <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Interviews Scheduled</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalInterviews}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Pending Applications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalPending}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Rejected Applications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalRejected}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                                    <CardHeader>
                                        <CardTitle>Selected Applications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">
                                            {stats.totalSelected}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
