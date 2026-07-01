import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import PageTransition from './shared/PageTransition'
import { JobCardSkeletonGrid } from './shared/Skeleton'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Jobs = () => {
    useGetAllJobs()
    const { allJobs, searchJobQuery } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState(allJobs)
    const [loading, setLoading] = useState(true)

    // filterState is the single source of truth; filters + search are combined together
    const [filterState, setFilterState] = useState({
        location: '',
        industry: '',
        salary: '',
    })

    const applyFilters = useCallback(() => {
        let filtered = [...allJobs]

        // 1. Keyword search (from Redux searchJobQuery)
        if (searchJobQuery) {
            const kw = searchJobQuery.toLowerCase()
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(kw) ||
                job.description?.toLowerCase().includes(kw) ||
                job.location?.toLowerCase().includes(kw)
            )
        }

        // 2. Location filter
        if (filterState.location) {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase().includes(filterState.location.toLowerCase())
            )
        }

        // 3. Industry / job type filter
        if (filterState.industry) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(filterState.industry.toLowerCase()) ||
                job.jobType?.toLowerCase().includes(filterState.industry.toLowerCase())
            )
        }

        // 4. Salary filter
        if (filterState.salary) {
            filtered = filtered.filter(job => {
                const salary = job.salary || 0
                if (filterState.salary === '0-40k') return salary <= 40
                if (filterState.salary === '42k-1lakh') return salary > 40 && salary <= 100
                if (filterState.salary === '1lakh-5lakh') return salary > 100 && salary <= 500
                return true
            })
        }

        setFilterJobs(filtered)
    }, [allJobs, searchJobQuery, filterState])

    useEffect(() => {
        applyFilters()
    }, [applyFilters])

    useEffect(() => {
        if (allJobs.length > 0) setLoading(false)
    }, [allJobs])

    return (
        <PageTransition>
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex gap-5'>
                    <div className='w-1/5'>
                        <FilterCard filterState={filterState} setFilterState={setFilterState} />
                    </div>
                    {loading && allJobs.length === 0
                        ? (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <JobCardSkeletonGrid count={6} />
                            </div>
                        )
                        : filterJobs.length <= 0
                        ? (
                            <div className='flex-1 flex flex-col items-center justify-center h-[60vh] text-gray-400'>
                                <svg className='w-16 h-16 mb-4 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                                <p className='text-lg font-medium'>No jobs found</p>
                                <p className='text-sm mt-1'>Try adjusting your filters or search query</p>
                            </div>
                        )
                        : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                    {filterJobs.map((job) => (
                                        <Job key={job?._id} job={job} />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default Jobs