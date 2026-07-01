import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { ArrowLeft, Building2, Loader as Loader2 } from 'lucide-react'
import PageTransition from '../shared/PageTransition'

const CompanyCreate = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [companyName, setCompanyName] = useState('')
    const [loading, setLoading] = useState(false)

    const registerNewCompany = async () => {
        if (!companyName.trim()) { toast.error('Please enter a company name'); return }
        try {
            setLoading(true)
            const res = await api.post('/company/register', { companyName })
            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company))
                toast.success(res.data.message)
                navigate(`/admin/companies/${res.data.company._id}`)
            }
        } catch (error) {
            toast.error(error.response && error.response.data ? error.response.data.message : 'Failed to create company')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageTransition>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-lg mx-auto px-4 py-16'>
                <div className='flex items-center gap-4 mb-10'>
                    <button
                        onClick={() => navigate('/admin/companies')}
                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                    </button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Register Company</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>Start by naming your company</p>
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8'>
                    {/* Icon */}
                    <div className='w-14 h-14 bg-[#6A38C2]/10 dark:bg-[#6A38C2]/20 rounded-2xl flex items-center justify-center mb-6'>
                        <Building2 className='w-7 h-7 text-[#6A38C2]' />
                    </div>

                    <h2 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>What's your company name?</h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                        Don't worry, you can always update this later in company settings.
                    </p>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Company Name</label>
                        <input
                            type='text'
                            placeholder='e.g. Google, Microsoft, Startup Inc.'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && registerNewCompany()}
                            className='w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigate('/admin/companies')}
                            className='flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={registerNewCompany}
                            disabled={loading}
                            className='flex-1 py-3 bg-[#6A38C2] text-white rounded-xl text-sm font-semibold hover:bg-[#5b30a6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2'
                        >
                            {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Creating...</> : 'Continue →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default CompanyCreate
