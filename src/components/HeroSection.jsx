import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <section className="relative bg-gradient-to-b from-[#1E40AF] to-[#2563EB] text-white p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between">
                {/* Text Content */}
                <div className="lg:w-1/2 max-w-2xl">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                        Your <span className="text-[#F59E0B]">Dream Job</span> Awaits
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-gray-200">
                        Workify connects you with top companies and helps you unlock
                        your full potential. Start your journey to success today.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                            onClick={() => navigate(`/Jobs`)}
                            className="px-6 py-3 font-semibold text-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                            Explore Jobs
                           
                        </Button>

                      
                    </div>
                </div>
                <div className="mt-12 lg:mt-0 flex justify-center">
                    <video
                        src="job2.mp4"
                        alt="Hero Video"
                        className="max-w-lg lg:max-w-3/4 object-cover shadow-lg opacity-80 rounded-3xl"
                        autoPlay
                        loop
                        muted
                    />
                </div>

               
            </div>
        </section>
    );
};

export default HeroSection;
