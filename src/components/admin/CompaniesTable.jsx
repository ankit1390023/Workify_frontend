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

const CompaniesTable = () => {
    const navigate = useNavigate();
    const { allCompanies, searchCompanyByText } = useSelector((state) => state.company);

    // Filter companies based on the search query directly in the render
    const filterCompany = allCompanies.filter((company) =>
        company.companyName.match(new RegExp(searchCompanyByText, 'gi'))
    );

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption>List of Registered Companies</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-800 md:font-semibold md:text-[15px]">
                    <TableRow className="bg-blue-600 text-white">
                        <TableHead className="w-[100px] font-bold">No.</TableHead> {/* Add row number header */}
                        <TableHead className="w-[100px] font-bold">Logo</TableHead>
                        <TableHead className="font-bold">Company Name</TableHead>
                        <TableHead className="font-bold">Registered Date</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length > 0 ? (
                        filterCompany.map((company, index) => (
                            <TableRow key={company._id}>
                                <TableCell>{index + 1}</TableCell> {/* Display row number */}
                                <TableCell>
                                    <img
                                        src={company.logo}
                                        alt={`${company.companyName} Logo`}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{company.companyName}</TableCell>
                                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        aria-label="Edit Job Details"
                                        className="gap-1 px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <TableCell colSpan={5} className="text-center text-xl font-bold">
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
