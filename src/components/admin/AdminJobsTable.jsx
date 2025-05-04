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
import { Badge } from '../ui/badge';

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
        <div className="overflow-x-auto">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow className="bg-card hover:bg-card/80 border-b border-border">
                        <TableHead className="w-[80px] font-semibold text-muted-foreground">No.</TableHead>
                        <TableHead className="w-[120px] font-semibold text-muted-foreground">Logo</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Company Name</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Job Title</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Registered Date</TableHead>
                        <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.length > 0 ? (
                        filterJobs.map((job, index) => (
                            <TableRow 
                                key={job._id} 
                                className="border-b border-border hover:bg-card/50 transition-colors duration-200"
                            >
                                <TableCell className="py-4 text-foreground">
                                    <Badge variant="outline" className="bg-card text-foreground">
                                        {index + 1}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                                        <img
                                            src={job?.company?.logo}
                                            alt={`${job?.company?.companyName} Logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-foreground font-medium">
                                    {job?.company?.companyName}
                                </TableCell>
                                <TableCell className="py-4 text-foreground font-medium">
                                    {job?.title}
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground">
                                    <Badge variant="secondary" className="bg-card/50">
                                        {new Date(job?.createdAt).toLocaleDateString()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                                            onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>Edit</span>
                                        </Button>
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
                                        No jobs have been posted yet
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Start by creating a new job posting
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
