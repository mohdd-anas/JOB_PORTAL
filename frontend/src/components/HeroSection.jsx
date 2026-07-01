import React, { useState } from 'react'
import { Search, TrendingUp, Users, Briefcase, Star } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchJobQuery } from '@/redux/jobSlice'

const popularKeywords = ['Frontend Developer', 'Backend Developer', 'Data Science', 'DevOps', 'UI/UX Designer']

const stats = [
    { icon: Briefcase, value: '1,200+', label: 'Live Jobs' },
    { icon: Users, value: '50K+', label: 'Job Seekers' },
    { icon: TrendingUp, value: '800+', label: 'Companies' },
    { icon: Star, value: '95%', label: 'Success Rate' },
]

const HeroSection = () => {
    const [query, setQuery] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchJobHandler = () => {
        dispatch(setSearchJobQuery(query.trim()))
        navigate('/browse')
    }

    return (
        <section className='relative bg-gradient-to-br from-[#f8f4ff] via-white to-[#eef2ff] dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-96 h-96 bg-[#6A38C2]/5 dark:bg-[#6A38C2]/10 rounded-full blur-3xl' />
                <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-[#F83002]/5 dark:bg-[#F83002]/10 rounded-full blur-3xl' />
            </div>

            <div className='relative max-w-7xl mx-auto px-4 py-20 lg:py-28'>
                <div className='flex flex-col lg:flex-row items-center gap-16'>
                    {/* Left */}
                    <div className='flex-1 text-center lg:text-left'>
                        <div className='inline-flex items-center gap-2 bg-[#6A38C2]/10 dark:bg-[#6A38C2]/20 text-[#6A38C2] px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                            <TrendingUp className='w-4 h-4' />
                            India's #1 Job Hunt Platform
                        </div>

                        <h1 className='text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6'>
                            Find Your{' '}
                            <span className='relative'>
                                <span className='text-[#6A38C2]'>Dream Career</span>
                                <svg className='absolute -bottom-2 left-0 w-full' viewBox='0 0 300 12' fill='none'>
                                    <path d='M1 9C50 3 100 1 150 5C200 9 250 11 299 7' stroke='#6A38C2' strokeWidth='3' strokeLinecap='round' opacity='0.3' />
                                </svg>
                            </span>
                            {' '}Today
                        </h1>

                        <p className='text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed'>
                            Connect with top companies, explore thousands of opportunities,
                            and take the next step in your professional journey.
                        </p>

                        {/* Search Box */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 flex flex-col sm:flex-row gap-2 mb-6 max-w-2xl mx-auto lg:mx-0'>
                            <div className='flex items-center gap-3 flex-1 px-4 py-2'>
                                <Search className='w-5 h-5 text-gray-400 shrink-0' />
                                <input
                                    type='text'
                                    placeholder='Job title, skills, or company...'
                                    className='outline-none w-full text-gray-700 dark:text-gray-200 bg-transparent text-sm placeholder-gray-400'
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
                                />
                            </div>
                            <button
                                onClick={searchJobHandler}
                                className='bg-[#6A38C2] text-white px-8 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#5b30a6] transition-colors shadow-sm shrink-0'
                            >
                                <Search className='w-4 h-4' />
                                Search Jobs
                            </button>
                        </div>

                        {/* Popular */}
                        <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2'>
                            <span className='text-sm text-gray-400 dark:text-gray-500 font-medium'>Popular:</span>
                            {popularKeywords.map((keyword, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        dispatch(setSearchJobQuery(keyword))
                                        navigate('/browse')
                                    }}
                                    className='text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:border-[#6A38C2] hover:text-[#6A38C2] dark:hover:border-[#6A38C2] transition-colors font-medium'
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div className='flex-1 flex justify-center lg:justify-end w-full'>
                        <div className='grid grid-cols-2 gap-4 w-full max-w-sm'>
                            {stats.map((stat, i) => {
                                const Icon = stat.icon
                                return (
                                    <div
                                        key={i}
                                        className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-shadow'
                                    >
                                        <div className='w-10 h-10 bg-[#6A38C2]/10 dark:bg-[#6A38C2]/20 rounded-xl flex items-center justify-center mx-auto mb-3'>
                                            <Icon className='w-5 h-5 text-[#6A38C2]' />
                                        </div>
                                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{stat.value}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{stat.label}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
