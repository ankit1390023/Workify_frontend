import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Edit2, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { setSingleJob, setSearchJobByText } from '@/redux/jobSlice';
import useGetSingleJobs from '../hooks/useGetSingleJob';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import axios from 'axios';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const AdminJobsTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { allAdminJobs, searchJobByText, isLoading } = useSelector((state) => state.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedJobId, setSelectedJobId] = useState(null);

    // Use the hook when a job is selected for editing
    const { isLoading: isJobLoading } = useGetSingleJobs(selectedJobId);

    // Debug logging
    useEffect(() => {
        console.log('Current state:', {
            isLoading,
            isJobLoading,
            allAdminJobs,
            filterJobs,
            searchJobByText,
            filterStatus
        });
    }, [isLoading, isJobLoading, allAdminJobs, filterJobs, searchJobByText, filterStatus]);

    // Function to handle job edit
    const handleEditJob = (jobId) => {
        setSelectedJobId(jobId);
    };

    // Effect to handle navigation after job details are loaded
    useEffect(() => {
        if (selectedJobId && !isJobLoading) {
            navigate(`/admin/jobUpdateDetails/${selectedJobId}`);
            setSelectedJobId(null);
        }
    }, [selectedJobId, isJobLoading, navigate]);

    // Sorting function
    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filterJobs].sort((a, b) => {
            if (key === 'createdAt') {
                return direction === 'asc' 
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            if (key === 'company.companyName') {
                const aValue = a.company?.companyName || '';
                const bValue = b.company?.companyName || '';
                return direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            const aValue = a[key] || '';
            const bValue = b[key] || '';
            return direction === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilterJobs(sortedData);
    };

    // Filtering function
    useEffect(() => {
        if (Array.isArray(allAdminJobs) && allAdminJobs.length > 0) {
            let filtered = [...allAdminJobs];
            
            // Text search filter
            if (searchJobByText) {
                const searchLower = searchJobByText.toLowerCase();
                filtered = filtered.filter((job) =>
                    (job.title?.toLowerCase().includes(searchLower) || 
                    job?.company?.companyName?.toLowerCase().includes(searchLower))
                );
            }

            // Status filter
            if (filterStatus !== 'all') {
                filtered = filtered.filter(job => job.status === filterStatus);
            }

            setFilterJobs(filtered);
        } else {
            setFilterJobs([]);
        }
    }, [allAdminJobs, searchJobByText, filterStatus]);

    // Handle search input change
    const handleSearchChange = (e) => {
        dispatch(setSearchJobByText(e.target.value));
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterJobs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filterJobs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Add handleDeleteJob function
    const handleDeleteJob = async (jobId) => {
        try {
            const response = await axios.delete(
                `${API_END_POINT}/job/delete/${jobId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );
            
            if (response.data.success) {
                toast.success("Job deleted successfully");
                // Update the local state by filtering out the deleted job
                setFilterJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            } else {
                toast.error(response.data.message || "Error deleting job");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while deleting the job");
        }
    };

    // Show loading state only when initially loading jobs
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading jobs...</p>
                </div>
            </div>
        );
    }

    // Show error state if no jobs are available
    if (!Array.isArray(allAdminJobs)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg text-destructive">Error loading jobs</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please try refreshing the page
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
           

            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-card hover:bg-card/80 border-b border-border">
                            <TableHead className="w-[80px] font-semibold text-muted-foreground">No.</TableHead>
                            <TableHead className="w-[120px] font-semibold text-muted-foreground">Logo</TableHead>
                            <TableHead 
                                className="font-semibold text-muted-foreground cursor-pointer"
                                onClick={() => sortData('company.companyName')}
                            >
                                <div className="flex items-center gap-2">
                                    Company Name
                                    <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead 
                                className="font-semibold text-muted-foreground cursor-pointer"
                                onClick={() => sortData('title')}
                            >
                                <div className="flex items-center gap-2">
                                    Job Title
                                    <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead 
                                className="font-semibold text-muted-foreground cursor-pointer"
                                onClick={() => sortData('createdAt')}
                            >
                                <div className="flex items-center gap-2">
                                    Registered Date
                                    <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length > 0 ? (
                            currentItems.map((job, index) => (
                                <TableRow 
                                    key={job._id} 
                                    className="border-b border-border hover:bg-card/50 transition-colors duration-200"
                                >
                                    <TableCell className="py-4 text-foreground">
                                        <Badge variant="outline" className="bg-card text-foreground">
                                            {indexOfFirstItem + index + 1}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                                            <img
                                                src={job?.company?.logo}
                                                alt={`${job?.company?.companyName} Logo`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-foreground font-medium">
                                        {job?.company?.companyName || 'N/A'}
                                    </TableCell>
                                    <TableCell className="py-4 text-foreground font-medium">
                                        {job?.title || 'N/A'}
                                    </TableCell>
                                    <TableCell className="py-4 text-muted-foreground">
                                        <Badge variant="secondary" className="bg-card/50">
                                            {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                                                onClick={() => handleEditJob(job._id)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                            
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the job posting
                                                            and all associated applications.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteJob(job._id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-200"
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-muted-foreground text-lg">
                                            No jobs found
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Try adjusting your search or filter criteria
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {[...Array(totalPages)].map((_, index) => (
                        <Button
                            key={index + 1}
                            variant={currentPage === index + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminJobsTable;
