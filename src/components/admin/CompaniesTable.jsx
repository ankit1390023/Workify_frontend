import React, { useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Edit2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '@/context/ThemeContext';

const CompaniesTable = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { allCompanies, searchCompanyByText } = useSelector((state) => state.company);

    // Filter companies based on the search query directly in the render
    const filterCompany = allCompanies.filter((company) =>
        company.companyName.match(new RegExp(searchCompanyByText, 'gi'))
    );

    return (
        <div className="overflow-x-auto p-4">
            <Table className="min-w-full bg-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
                <TableCaption className="text-muted-foreground">List of Registered Companies</TableCaption>
                <TableHeader>
                    <TableRow className="bg-blue-600 dark:bg-blue-700 text-white">
                        <TableHead className="w-[100px] font-bold">No.</TableHead>
                        <TableHead className="w-[100px] font-bold">Logo</TableHead>
                        <TableHead className="font-bold">Company Name</TableHead>
                        <TableHead className="font-bold">Registered Date</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length > 0 ? (
                        filterCompany.map((company, index) => (
                            <TableRow key={company._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="text-foreground">{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={company.logo}
                                        alt={`${company.companyName} Logo`}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{company.companyName}</TableCell>
                                <TableCell className="text-muted-foreground">{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        aria-label="Edit Job Details"
                                        className="gap-1 px-2 py-1 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-md shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-xl font-bold text-muted-foreground">
                                No Companies have been registered yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
