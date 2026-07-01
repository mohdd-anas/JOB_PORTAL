import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import api from '@/lib/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Applicants = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await api.get(`/application/${params.id}/applicants`)
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.applicants))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllApplicants()
    }, [params.id])

    return (
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
    )
}

export default Applicants