import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'
import PageTransition from './shared/PageTransition'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Home = () => {
    useGetAllJobs()
    return (
        <PageTransition>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
            <Footer />
        </PageTransition>
    )
}

export default Home