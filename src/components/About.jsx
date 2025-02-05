import Footer from "./shared/Footer";
import Header from "./shared/Header";

export default function About() {
    return (
        <div>
            <Header/>
        <div className="py-16 bg-white dark:bg-gray-800">
            <div className="container m-auto px-6 text-gray-600 dark:text-gray-200 md:px-12 xl:px-6">
                <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                    {/* Left Section: Image */}
                    <div className="md:w-5/12 lg:w-5/12">
                        <img
                            src="https://img.freepik.com/free-vector/choice-worker-concept-illustrated_52683-44076.jpg?t=st=1734118342~exp=1734121942~hmac=ca9ef83e0acb87ad058ad84a0c48d8e11e1c6dd2ac30292f735110d5c167d3cf&w=2000"
                            alt="Job Portal Illustration"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Right Section: Description */}
                    <div className="md:w-7/12 lg:w-6/12">
                        <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold md:text-4xl">
                            Job Portal: Connecting Students and Recruiters
                        </h2>
                        <p className="mt-6 text-gray-600 dark:text-gray-300">
                            Our job portal platform bridges the gap between students seeking job opportunities and recruiters looking for fresh talent. We provide an easy-to-use, intuitive interface for both students and recruiters to find what they need quickly and effectively.
                        </p>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Whether you are a student looking for your next career opportunity or a recruiter searching for the perfect candidate, our platform offers personalized services to meet your needs. From job search filters to application tracking and messaging features, we've got you covered.
                        </p>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Our platform is built with cutting-edge technologies like React, Node.js, and MongoDB, providing a smooth and scalable experience for all users. Join us today to make your job search or hiring process more efficient.
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <Footer/>
        </div>
    );
}
