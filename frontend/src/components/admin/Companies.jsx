import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CompaniesTable from './CompaniesTable'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Plus, Search, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import PageTransition from '../shared/PageTransition'

const Companies = () => {
    useGetAllCompanies()
    const [input, setInput] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { companies } = useSelector(store => store.company)

    useEffect(() => {
        dispatch(setSearchCompanyByText(input))
    }, [input])

    return (
        <PageTransition>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Companies</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
                            {companies.length} compan{companies.length !== 1 ? 'ies' : 'y'} registered
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/companies/create')}
                        className='flex items-center gap-2 bg-[#6A38C2] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5b30a6] transition-colors shadow-sm'
                    >
                        <Plus className='w-4 h-4' />
                        Register Company
                    </button>
                </div>

                {/* Search */}
                <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search by company name...'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                        />
                    </div>
                </div>

                {/* Table */}
                <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
                    <CompaniesTable />
                </div>

                {companies.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='w-16 h-16 bg-[#6A38C2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <Building2 className='w-8 h-8 text-[#6A38C2]' />
                        </div>
                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>No companies registered</h3>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mb-4'>Register a company to start posting jobs.</p>
                        <button
                            onClick={() => navigate('/admin/companies/create')}
                            className='bg-[#6A38C2] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5b30a6] transition-colors'
                        >
                            Register First Company
                        </button>
                    </div>
                )}
            </div>
        </div>
        </PageTransition>
    )
}

export default Companies
