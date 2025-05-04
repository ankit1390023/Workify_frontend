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
        <div className="max-w-screen-xs md:max-w-screen-md lg:max-w-screen-lg p-2 mt-10 ml-8">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 m-6 text-justify">Frequently Asked Questions</h1>
            <div className="bg-background p-6 rounded-lg">
                <Accordion type="single" collapsible>
                    {qA.map((item, index) => (
                        <AccordionItem 
                            key={index} 
                            value={`item-${index}`} 
                            className="mb-4 border-gray-200 dark:border-gray-700"
                        >
                            <AccordionTrigger 
                                className="text-lg font-semibold text-blue-600 dark:text-blue-400 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 ease-in-out"
                            >
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent 
                                className="p-4 text-gray-700 dark:text-gray-300 text-sm rounded-lg"
                            >
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
