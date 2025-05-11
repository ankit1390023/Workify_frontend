import React, { useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const ApplicantsTable = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { allApplicants } = useSelector((state) => state.application);
    const [applicants, setApplicants] = useState(allApplicants);

    const statusChangeHandler = async (applicationId, status) => {
        try {
            const res = await axios.post(
                `${API_END_POINT}/application/status/${applicationId}/update`,
                { status },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );

            if (res.data.success) {
                toast.success("Status updated successfully!");
                handleStatusChange(applicationId, status);
            } else {
                toast.error(`Failed to update status: ${res.data.message}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status. Please try again.");
        }
    };

    const handleStatusChange = (applicantId, newStatus) => {
        const updatedApplicants = applicants.map((applicant) => {
            if (applicant._id === applicantId) {
                return { ...applicant, status: newStatus };
            }
            return applicant;
        });
        setApplicants(updatedApplicants);
    };

    return (
        <div className="overflow-x-auto p-4">
            <Table className="min-w-full bg-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
                <TableCaption className="text-xl font-semibold text-muted-foreground">
                    List of Recent Applicants
                </TableCaption>
                <TableHeader className="bg-blue-600 dark:bg-blue-700 text-white text-lg">
                    <TableRow>
                        <TableHead className="px-4 py-2">No</TableHead>
                        <TableHead className="px-4 py-2">Full Name</TableHead>
                        <TableHead className="px-4 py-2">Email</TableHead>
                        <TableHead className="px-4 py-2">Contact</TableHead>
                        <TableHead className="px-4 py-2">Resume</TableHead>
                        <TableHead className="px-4 py-2">Date</TableHead>
                        <TableHead className="px-4 py-2">Profile</TableHead>
                        <TableHead className="px-4 py-2 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants.length > 0 ? (
                        applicants.map((item, index) => {
                            const rowColor =
                                item.status === 'accepted'
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : item.status === 'rejected'
                                        ? 'bg-red-100 dark:bg-red-900/30'
                                        : item.status === 'interview'
                                            ? 'bg-sky-100 dark:bg-sky-900/30'
                                            : 'bg-yellow-100 dark:bg-yellow-900/30';

                            return (
                                <TableRow
                                    key={item._id}
                                    className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${rowColor}`}
                                >
                                    <TableCell className="font-medium px-4 py-3 text-foreground">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium px-4 py-3 text-foreground">
                                        {item?.applicant?.fullName}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-foreground">{item?.applicant?.email}</TableCell>
                                    <TableCell className="px-4 py-3 text-foreground">{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        {item?.applicant?.profile?.resume ? (
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                                href={item?.applicant?.profile?.resume}
                                                download={item?.applicant?.profile?.resumeOriginalName}
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">Not available</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">
                                        {new Date(item?.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Button
                                            aria-label="View Applicant"
                                            variant="ghost"
                                            onClick={() => navigate(`/admin/jobs/view-applicantion/${item?._id}`)}
                                            className={`flex items-center justify-center p-2 rounded-md bg-${rowColor} text-blue-600 dark:text-blue-400 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <EyeIcon size={24} color={theme === 'dark' ? '#60A5FA' : '#1D4ED8'} />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right px-4 py-3">
                                        <Select
                                            value={item.status}
                                            onValueChange={(value) =>
                                                statusChangeHandler(item._id, value)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-[100px] text-white rounded-md ${item.status === 'accepted'
                                                    ? 'bg-green-500 dark:bg-green-600'
                                                    : item.status === 'rejected'
                                                        ? 'bg-red-500 dark:bg-red-600'
                                                        : item.status === 'interview'
                                                            ? 'bg-sky-500 dark:bg-sky-600'
                                                            : 'bg-yellow-500 dark:bg-yellow-600'
                                                    }`}
                                            >
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background text-foreground">
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="selected">Selected</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                <SelectItem value="interview">Interview</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center text-xl font-bold py-4 text-muted-foreground"
                            >
                                No applicants have been registered yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
