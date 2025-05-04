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
import { Edit2, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '@/context/ThemeContext';

const AdminJobsTable = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { allAdminJobs, searchJobByText } = useSelector((state) => state.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        if (allAdminJobs.length > 0) {
            const regex = new RegExp(searchJobByText, 'gi');
            const filtered = allAdminJobs.filter((job) =>
                job.title.match(regex) || job?.company?.companyName.match(regex)
            );
            setFilterJobs(filtered);
        } else {
            setFilterJobs([]);
        }
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className="overflow-x-auto p-4">
            <Table className="min-w-full bg-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
                <TableHeader>
                    <TableRow className="bg-blue-600 dark:bg-blue-700 text-white">
                        <TableHead className="w-[80px] font-semibold">No.</TableHead>
                        <TableHead className="w-[120px] font-semibold">Logo</TableHead>
                        <TableHead className="font-semibold">Company Name</TableHead>
                        <TableHead className="font-semibold">Job Title</TableHead>
                        <TableHead className="font-semibold">Registered Date</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.length > 0 ? (
                        filterJobs.map((job, index) => (
                            <TableRow key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="py-4 text-foreground">{index + 1}.</TableCell>
                                <TableCell className="py-4">
                                    <img
                                        src={job?.company?.logo}
                                        alt={`${job?.company?.companyName} Logo`}
                                        className="w-12 h-12 object-cover rounded-full"
                                    />
                                </TableCell>
                                <TableCell className="py-4 text-foreground font-medium">{job?.company?.companyName}</TableCell>
                                <TableCell className="py-4 text-foreground font-medium">{job?.title}</TableCell>
                                <TableCell className="py-4 text-muted-foreground">{new Date(job?.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-2 flex-col sm:flex-row">
                                        <Button
                                            aria-label="Edit Job Details"
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 rounded-md shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={() => navigate(`/admin/companyUpdateDetails/${job._id}`)}
                                        >
                                            <Edit2 className="w-5 h-5" />
                                            <span>Edit</span>
                                        </Button>
                                        <Button
                                            aria-label="View Applicants"
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 dark:bg-green-600 rounded-md shadow-md hover:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                        >
                                            <Eye className="w-5 h-5" />
                                            <span>Applicants</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-xl font-semibold py-4 text-muted-foreground">
                                No Jobs have been posted yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
