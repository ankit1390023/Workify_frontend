import { Button } from './ui/button';

const HeroSection = () => {
   


    return (
        <section className="relative bg-black text-white dark:bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-1">
                <img
                    src="istockphoto-1435687184-1024x1024.jpg"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-40"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
                {/* Text Content */}
                <div className="max-w-2xl lg:w-1/2">
                    <h1 className="text-3xl lg:text-6xl font-extrabold leading-tight">
                        Find Your <span className="text-[#F59E0B]">Dream Job</span>
                    </h1>
                    <p className="mt-6 text-base lg:text-xl text-gray-100 dark:text-gray-300">
                        Explore thousands of job opportunities that align with your career goals and skills. 
                        Kickstart your journey with Workify today!
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row sm:space-x-6">
                        <Button
                            className="w-full sm:w-auto px-6 py-3 font-semibold text-white border-2 border-white rounded-lg text-lg hover:bg-white hover:text-[#1D4ED8] transition duration-300"
                        >
                            Get Started
                        </Button>
                        <Button
                            className="w-full sm:w-auto px-6 py-3 font-semibold text-white border-2 border-white rounded-lg text-lg hover:bg-white hover:text-[#1D4ED8] transition duration-300"
                        >
                            Learn More
                        </Button>
                        <Button
                            className="w-full sm:w-auto px-6 py-3 font-semibold text-white border-2 border-white rounded-lg text-lg hover:bg-white hover:text-[#1D4ED8] transition duration-300"
                        >
                            Explore Jobs
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
