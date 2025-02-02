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
import { Card, CardContent } from "./ui/card";

const category = [
    "Software Development",
    "Data Science",
    "Web Development",
    "DevOps",
    "React native",
    "MernStack development",
    "Cloud Computing",
   
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
        <div className="max-w-xs sm:max-w-2xl mx-auto px-4 md:px-8 lg:px-16">
            <Carousel className="w-full my-10">
                <CarouselContent className="-ml-1 ">
                    {category.map((cat, index) => {
                        return (
                            <CarouselItem
                                key={index}
                                className="pl-1 basis-1/2 sm:basis-1/3 mx-6"
                            >
                                <div className="p-1 mx-6">
                                            <Button
                                                onClick={() => searchJobHandler(cat)}
                                               
                                            className="text-center max-w-fit  border-2 border-blue-500 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all p-4 rounded-2xl "
                                            >
                                                {cat}
                                            </Button>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
