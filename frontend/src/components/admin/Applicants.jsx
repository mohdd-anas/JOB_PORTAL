import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { supabase, mapUser } from '@/lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import PageTransition from '../shared/PageTransition'

const Applicants = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const { data: applicationRows, error } = await supabase
                    .from('applications')
                    .select('*, applicant:users(*)')
                    .eq('job_id', params.id)
                    .order('created_at', { ascending: false })
                if (error) {
                    console.log(error)
                    return
                }
                const applicants = (applicationRows || []).map(row => ({
                    _id: row.id,
                    applicant: mapUser(row.applicant),
                    status: row.status,
                    createdAt: row.created_at
                }))
                dispatch(setAllApplicants(applicants))
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllApplicants()
    }, [params.id])

    return (
        <PageTransition>
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center gap-4 my-5'>
                    <Button
                        onClick={() => navigate('/admin/jobs')}
                        variant='outline'
                        className='flex items-center gap-2'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Jobs
                    </Button>
                    <h1 className='font-bold text-xl'>Applicants</h1>
                </div>
                <ApplicantsTable />
            </div>
        </div>
        </PageTransition>
    )
}

export default Applicants
