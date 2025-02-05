import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

const MyAccordion = () => {
    const qA = [
        {
            question: "How do I apply for a job?",
            answer: "To apply for a job, you need to sign in, go to the job listings, and click on the 'Apply' button under the job description. Then, submit your resume and any other required documents."
        },
        {
            question: "How do I post a job as an employer?",
            answer: "Employers can post jobs by signing in, navigating to the employer dashboard, and filling out the job posting form. After submitting the details, your job listing will be visible to job seekers."
        },
        {
            question: "How can I track the status of my application?",
            answer: "Once you've applied for a job, you can track the status from your dashboard. You'll receive notifications about any updates, such as interviews or rejections."
        },
        {
            question: "Can I apply to multiple jobs at once?",
            answer: "Yes, you can apply to as many jobs as you'd like. However, we recommend tailoring your resume and application for each job to increase your chances of success."
        }
    ];
    return (
        <div className="max-w-screen-xs md:max-w-screen-md lg:max-w-screen-lg  p-4">
            <h1 className="text-3xl font-semibold text-gray-800 m-6 text-justify">Frequently Asked Questions</h1>
            <div className="bg-white p-6 rounded-lg">
                <Accordion type="single" collapsible>
                    {qA.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="mb-4">
                            <AccordionTrigger className="text-lg font-semibold text-blue-600 py-4  rounded-lg shadow-sm hover:bg-blue-100 transition duration-300 ease-in-out">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="p-4 text-gray-700 text-sm rounded-lg bg-gray-50">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default MyAccordion;
