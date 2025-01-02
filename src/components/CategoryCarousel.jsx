import { useNavigate } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import { Button } from './ui/button';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setSearchQuery } from "@/redux/jobSlice";

const category = [
    "Software Development",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Design",
    "DevOps",
    "Management",
    "Marketing",
    "React native",
    "Customer Support",
    "Mern Stack development",
    "Cloud Computing",
    "Product",
    "All",
];

const CategoryCarousel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    // Search company by text
    const searchJobHandler = (query) => {
        dispatch(setSearchQuery(query));
        navigate("/browse");
    };

    return (
        <div className="dark:bg-gray-800 p-5">
            <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent className="flex-shrink">
                    {category.map((cat, index) => {
                        return (
                            <CarouselItem
                                key={index}
                                className="flex-shrink-0 w-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                            >
                                <Button
                                    onClick={() => searchJobHandler(cat)}
                                    variant="outline"
                                    className="rounded-full border-2 border-blue-500 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
