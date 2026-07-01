import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { supabase, mapUser } from '@/lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { ArrowLeft, Users } from 'lucide-react'

const Applicants = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { applicants } = useSelector(store => store.application)

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const { data, error } = await supabase
                    .from('applications')
                    .select('*, applicant:users(*)')
                    .eq('job_id', params.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                const mapped = (data || []).map(row => {
                    const user = mapUser(row.applicant)
                    return {
                        _id: row.id,
                        applicant: user,
                        status: row.status,
                        createdAt: row.created_at,
                    }
                })
                dispatch(setAllApplicants(mapped))
            } catch (error) {
                console.error('[AdminJobsTable]', error.message)
            }
        }
        fetchAllApplicants()
    }, [params.id])

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='flex items-center gap-4 mb-8'>
                    <button
                        onClick={() => navigate('/admin/jobs')}
                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                    </button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Applicants</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-0.5'>
                            {applicants ? applicants.length : 0} applicant{applicants && applicants.length !== 1 ? 's' : ''} for this position
                        </p>
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
                    {applicants && applicants.length === 0 ? (
                        <div className='text-center py-16'>
                            <div className='w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                                <Users className='w-7 h-7 text-gray-400' />
                            </div>
                            <h3 className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>No applicants yet</h3>
                            <p className='text-sm text-gray-400'>Share your job listing to attract candidates.</p>
                        </div>
                    ) : (
                        <ApplicantsTable />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Applicants
