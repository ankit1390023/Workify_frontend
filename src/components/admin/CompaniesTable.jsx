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
import { Edit2, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '../ui/badge';

const CompaniesTable = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { allCompanies, searchCompanyByText } = useSelector((state) => state.company);

    // Filter companies based on the search query directly in the render
    const filterCompany = allCompanies.filter((company) =>
        company.companyName.match(new RegExp(searchCompanyByText, 'gi'))
    );

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Table>
                <TableCaption className="mt-4 text-sm text-muted-foreground">
                    List of registered companies in the system
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[80px] font-medium">No.</TableHead>
                        <TableHead className="w-[100px] font-medium">Logo</TableHead>
                        <TableHead className="font-medium">Company Name</TableHead>
                        <TableHead className="font-medium">Registered Date</TableHead>
                        <TableHead className="text-right font-medium">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length > 0 ? (
                        filterCompany.map((company, index) => (
                            <TableRow 
                                key={company._id} 
                                className="group transition-colors hover:bg-muted/50"
                            >
                                <TableCell className="font-medium text-muted-foreground">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={`${company.companyName} Logo`}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <Building2 className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-foreground">{company.companyName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {company.location}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                        {new Date(company.createdAt).toLocaleDateString()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-muted"
                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        <span className="sr-only">Edit company</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Building2 className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        No companies have been registered yet.
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

export default CompaniesTable;
