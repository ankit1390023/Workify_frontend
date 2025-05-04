import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit2, Eye, Mail, Phone, FileText, Linkedin, Github } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '@/context/ThemeContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicantsCards = () => {
    const params = useParams();
    const { theme } = useTheme();
    const applicationId = params.id;
    const { allApplicants } = useSelector((state) => state.application);
    const [filteredApplication, setFilteredApplication] = useState([]);

    useEffect(() => {
        if (allApplicants && applicationId) {
            const filtered = allApplicants.filter(applicant => applicant._id === applicationId);
            setFilteredApplication(filtered);
        } else {
            setFilteredApplication([]);
        }
    }, [allApplicants, applicationId]);

    return (
        <div className="max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
                Applicant Profile
            </h2>
            {filteredApplication.length > 0 ? (
                <div className="space-y-6">
                    {filteredApplication.map((item) => (
                        <Card key={item._id} className="border-border">
                            <CardHeader className="relative">
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        Applied on: {new Date(item?.createdAt).toLocaleDateString()}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {item?.applicant?.profile?.avatar ? (
                                            <img
                                                src={item?.applicant?.profile?.avatar}
                                                alt="Avatar"
                                                className="w-20 h-20 rounded-full border-4 border-card object-cover"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-2xl text-primary">
                                                    {item?.applicant?.fullName?.[0]?.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-foreground">
                                            {item?.applicant?.fullName}
                                        </CardTitle>
                                        <p className="text-muted-foreground">
                                            {item?.applicant?.profile?.bio}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 p-3 bg-card rounded-lg">
                                            <Mail className="w-5 h-5 text-primary" />
                                            <span className="text-foreground">{item?.applicant?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-card rounded-lg">
                                            <Phone className="w-5 h-5 text-primary" />
                                            <span className="text-foreground">{item?.applicant?.phoneNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item?.applicant?.profile?.skills?.length ? (
                                            item?.applicant?.profile?.skills?.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-primary/10 text-primary"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No skills added yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Resume */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Resume</h3>
                                    {item?.applicant?.profile?.resume ? (
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            asChild
                                        >
                                            <Link
                                                to={`${item?.applicant?.profile?.resume}?fl_attachment=false`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FileText className="w-4 h-4" />
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <p className="text-muted-foreground">Resume not available</p>
                                    )}
                                </div>

                                {/* Cover Letter */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
                                    <div className="p-4 bg-card rounded-lg">
                                        <p className="text-foreground">
                                            {item?.applicant?.profile?.coverLetter ||
                                                "No cover letter provided"}
                                        </p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            asChild
                                        >
                                            <a
                                                href="https://www.linkedin.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                LinkedIn
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            asChild
                                        >
                                            <a
                                                href="https://www.github.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Github className="w-4 h-4" />
                                                GitHub
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        No applicant details found
                    </p>
                </div>
            )}
        </div>
    );
};

export default ApplicantsCards;
