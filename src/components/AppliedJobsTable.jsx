import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const AppliedJobsTable = () => {
    const navigate = useNavigate();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_END_POINT}/application/getAppliedJobs`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        },
                    }
                );
                if (response.data.success) {
                    setAppliedJobs(response.data.data);
                } else {
                    toast.error(response.data.message || "Error fetching applied jobs");
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    const getBadgeColor = (status) => {
        switch (status) {
            case "accepted":
                return "bg-green-600 dark:bg-green-600 text-white";
            case "interview":
                return "bg-blue-500 dark:bg-blue-500 text-white";
            case "pending":
                return "bg-yellow-500 dark:bg-yellow-500 text-white";
            case "rejected":
                return "bg-red-600 dark:bg-red-600 text-white";
            default:
                return "bg-gray-400 dark:bg-gray-500 text-white";
        }
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto p-6 bg-white dark:bg-black/80 rounded-xl shadow-sm border border-gray-200 dark:border-black/40 flex items-center justify-center min-h-[400px]"
            >
                <div className="flex flex-col items-center gap-4">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading applied jobs...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto p-6 bg-white dark:bg-black/80 rounded-xl shadow-sm border border-gray-200 dark:border-black/40"
        >
            <Table className="w-full border-separate border-spacing-0 rounded-lg">
                <TableCaption className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    A list of jobs you have applied for recently.
                </TableCaption>
                <TableHeader className="bg-blue-100 dark:bg-black/60 rounded-t-lg">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-left text-sm text-gray-700 dark:text-white font-semibold py-4">
                            Application Date
                        </TableHead>
                        <TableHead className="text-left text-sm text-gray-700 dark:text-white font-semibold py-4">
                            Company
                        </TableHead>
                        <TableHead className="text-left text-sm text-gray-700 dark:text-white font-semibold py-4 w-[200px]">
                            Job Title
                        </TableHead>
                        <TableHead className="text-left text-sm text-gray-700 dark:text-white font-semibold py-4">
                            Status
                        </TableHead>
                        <TableHead className="text-right text-sm text-gray-700 dark:text-white font-semibold py-4">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map((item, index) => (
                            <motion.tr
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-black/40"
                            >
                                <TableCell className="text-sm py-4 px-4 text-gray-700 dark:text-gray-200">
                                    {new Date(item.createdAt).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="text-sm py-4 px-4 text-gray-700 dark:text-gray-200">
                                    {item?.job?.company?.companyName || "N/A"}
                                </TableCell>
                                <TableCell className="text-sm font-medium py-4 px-4 text-gray-900 dark:text-white">
                                    {item?.job?.title || "N/A"}
                                </TableCell>
                                <TableCell className="py-4 px-4">
                                    <Badge
                                        className={`py-1 px-3 rounded-full text-sm ${getBadgeColor(item.status)}`}
                                    >
                                        {item.status || "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-4 px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            onClick={() => navigate(`/jobDescription/${item?.job?._id}`)}
                                            aria-label={`View details for ${item?.job?.title || "N/A"}`}
                                            className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                        >
                                            View
                                        </Button>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell 
                                colSpan={5} 
                                className="text-center text-sm py-8 text-gray-500 dark:text-gray-300"
                            >
                                No jobs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </motion.div>
    );
};

export default AppliedJobsTable;
