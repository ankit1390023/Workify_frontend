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
import { API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const AppliedJobsTable = () => {
    const navigate = useNavigate();
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await axios.get(
                    `${API_END_POINT}/application/getAppliedJobs`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        },
                    }
                );
                console.log("response.data from appliedJobTable", response.data.data);
                if (response.data.success) {
                    setAppliedJobs(response.data.data);
                } else {
                    toast.error(response.data.message || "Error fetching applied jobs");
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        };

        fetchAppliedJobs();
    }, []);

    console.log("appliedJobs", appliedJobs);

    const getBadgeColor = (status) => {
        switch (status) {
            case "accepted":
                return "bg-green-600 text-white"; // Green for Accepted
            case "interview":
                return "bg-blue-500 text-white"; // Blue for Interview
            case "pending":
                return "bg-yellow-500 text-white"; // Yellow for Pending
            case "rejected":
                return "bg-red-600 text-white"; // Red for Rejected
            default:
                return "bg-gray-400 text-white"; // Default color for other status
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl">
            <Table className="w-full border-separate border-spacing-0 rounded-lg">
                <TableCaption className="text-sm text-secondary-foreground mb-4">
                    A list of jobs you have applied for recently.
                </TableCaption>
                <TableHeader className="bg-blue-100 rounded-t-lg">
                    <TableRow>
                        <TableHead className="text-left text-sm text-primary-foreground font-bold">
                            Application Date
                        </TableHead>
                        <TableHead className="text-left text-sm text-primary-foreground font-bold">
                            Company
                        </TableHead>
                        <TableHead className="text-left text-sm text-primary-foreground font-bold w-[200px]">
                            Job Title
                        </TableHead>
                        <TableHead className="text-left text-sm text-primary-foreground font-bold">
                            Status
                        </TableHead>
                        <TableHead className="text-right text-sm text-primary-foreground font-bold">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map((item) => (
                            <TableRow
                                key={item._id}
                                className="transition-colors hover:bg-blue-50"
                            >
                                <TableCell className="text-sm py-3 px-4">
                                    {new Date(item.createdAt).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="text-sm py-3 px-4">
                                    {item?.job?.company?.companyName || "N/A"}
                                </TableCell>
                                <TableCell className="text-sm font-medium py-3 px-4">
                                    {item?.job?.title || "N/A"}
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                    <Badge
                                        className={`py-1 px-3 rounded-full text-sm ${getBadgeColor(item.status)}`}
                                    >
                                        {item.status || "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right py-3 px-4">
                                    <Button
                                        onClick={() => navigate(`/jobDescription/${item?.job?._id}`)}
                                        aria-label={`View details for ${item?.job?.title || "N/A"}`}
                                        className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-sm py-4 text-gray-500">
                                No jobs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobsTable;
