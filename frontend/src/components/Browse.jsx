import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchJobQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useLocation } from 'react-router-dom'

const Browse = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    // Read ?search= param from URL (used by CategoryCarousel)
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const searchFromUrl = params.get('search') || ''
        dispatch(setSearchJobQuery(searchFromUrl))

        return () => {
            dispatch(setSearchJobQuery(''))
        }
    }, [location.search])

    useGetAllJobs()
    const { allJobs } = useSelector(store => store.job)

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                {allJobs.length === 0
                    ? <p className='text-gray-500'>No jobs found.</p>
                    : <div className='grid grid-cols-3 gap-4'>
                        {allJobs.map((job) => (
                            <Job key={job?._id} job={job} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default Browse
