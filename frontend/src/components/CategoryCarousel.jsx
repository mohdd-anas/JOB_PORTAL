import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const navigate = useNavigate()

    return (
        <div>
            <Carousel className='w-full max-w-xl mx-auto my-20'>
                <CarouselContent>
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                            <Button
                                onClick={() => navigate(`/browse?search=${cat}`)}
                                variant='outline'
                                className='rounded-full'
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel