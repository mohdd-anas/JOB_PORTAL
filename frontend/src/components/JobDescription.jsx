import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '@/redux/jobSlice'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Briefcase, Clock, IndianRupee, Users, Calendar, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react'
import PageTransition from './shared/PageTransition'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isInitiallyApplied = singleJob?.applications?.some(
        application => application.applicant === user?._id
    ) || false

    const [isApplied, setIsApplied] = useState(isInitiallyApplied)

    const applyJobHandler = async () => {
        try {
            const res = await api.post(`/application/apply/${jobId}`, {})
            if (res.data.success) {
                setIsApplied(true)
                dispatch(setSingleJob({
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }]
                }))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Apply failed')
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await api.get(`/job/getjob/${jobId}`)
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(
                        application => application.applicant === user?._id
                    ))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    return (
        <PageTransition>
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-5xl mx-auto px-4 py-10'>
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-gray-500 hover:text-[#6A38C2] mb-6 transition-colors'
                >
                    <ArrowLeft className='w-4 h-4' />
                    <span className='text-sm font-medium'>Back to Jobs</span>
                </button>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Job Header */}
                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            <div className='flex items-start gap-4'>
                                <Avatar className='h-16 w-16 rounded-xl border border-gray-100'>
                                    <AvatarImage src={singleJob?.company?.logo} />
                                    <AvatarFallback className='bg-[#6A38C2]/10 text-[#6A38C2] font-bold rounded-xl text-2xl'>
                                        {singleJob?.company?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <h1 className='text-2xl font-bold text-gray-900'>{singleJob?.title}</h1>
                                    <p className='text-gray-500 mt-1'>{singleJob?.company?.name}</p>
                                    <div className='flex flex-wrap gap-3 mt-3'>
                                        <span className='flex items-center gap-1 text-sm text-gray-500'>
                                            <MapPin className='w-4 h-4 text-[#6A38C2]' />
                                            {singleJob?.location}
                                        </span>
                                        <span className='flex items-center gap-1 text-sm text-gray-500'>
                                            <Briefcase className='w-4 h-4 text-[#6A38C2]' />
                                            {singleJob?.jobType}
                                        </span>
                                        <span className='flex items-center gap-1 text-sm text-gray-500'>
                                            <IndianRupee className='w-4 h-4 text-[#6A38C2]' />
                                            {singleJob?.salary} LPA
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            <h2 className='text-lg font-bold text-gray-900 mb-4'>Job Description</h2>
                            <p className='text-gray-600 leading-relaxed'>{singleJob?.description}</p>
                        </div>

                        {/* Requirements */}
                        {singleJob?.requirements?.length > 0 && (
                            <div className='bg-white rounded-2xl p-6 shadow-sm'>
                                <h2 className='text-lg font-bold text-gray-900 mb-4'>Requirements</h2>
                                <ul className='space-y-2'>
                                    {singleJob?.requirements?.map((req, index) => (
                                        <li key={index} className='flex items-start gap-2 text-gray-600 text-sm'>
                                            <CheckCircle className='w-4 h-4 text-[#6A38C2] mt-0.5 shrink-0' />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-4'>
                        {/* Apply Card */}
                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            {user && user.role === 'student' && (
                                <button
                                    onClick={isApplied ? null : applyJobHandler}
                                    disabled={isApplied}
                                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors mb-4 ${
                                        isApplied
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                            : 'bg-[#6A38C2] text-white hover:bg-[#5b30a6]'
                                    }`}
                                >
                                    {isApplied ? '✓ Already Applied' : 'Apply Now'}
                                </button>
                            )}

                            <div className='space-y-3'>
                                <div className='flex items-center justify-between py-2 border-b border-gray-50'>
                                    <span className='text-sm text-gray-500 flex items-center gap-2'>
                                        <Users className='w-4 h-4' /> Positions
                                    </span>
                                    <span className='text-sm font-semibold text-gray-900'>{singleJob?.position}</span>
                                </div>
                                <div className='flex items-center justify-between py-2 border-b border-gray-50'>
                                    <span className='text-sm text-gray-500 flex items-center gap-2'>
                                        <Briefcase className='w-4 h-4' /> Experience
                                    </span>
                                    <span className='text-sm font-semibold text-gray-900'>{singleJob?.experienceLevel} yrs</span>
                                </div>
                                <div className='flex items-center justify-between py-2 border-b border-gray-50'>
                                    <span className='text-sm text-gray-500 flex items-center gap-2'>
                                        <IndianRupee className='w-4 h-4' /> Salary
                                    </span>
                                    <span className='text-sm font-semibold text-gray-900'>{singleJob?.salary} LPA</span>
                                </div>
                                <div className='flex items-center justify-between py-2 border-b border-gray-50'>
                                    <span className='text-sm text-gray-500 flex items-center gap-2'>
                                        <Users className='w-4 h-4' /> Applicants
                                    </span>
                                    <span className='text-sm font-semibold text-gray-900'>{singleJob?.applications?.length}</span>
                                </div>
                                <div className='flex items-center justify-between py-2'>
                                    <span className='text-sm text-gray-500 flex items-center gap-2'>
                                        <Calendar className='w-4 h-4' /> Posted
                                    </span>
                                    <span className='text-sm font-semibold text-gray-900'>{singleJob?.createdAt?.split('T')[0]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        {singleJob?.company && (
                            <div className='bg-white rounded-2xl p-6 shadow-sm'>
                                <h3 className='font-bold text-gray-900 mb-3'>About Company</h3>
                                <p className='text-sm text-gray-500'>{singleJob?.company?.description || 'No description available.'}</p>
                                {singleJob?.company?.website && (
                                    <a href={singleJob?.company?.website} target='_blank' rel='noreferrer'
                                        className='text-sm text-[#6A38C2] hover:underline mt-2 block'>
                                        Visit Website →
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default JobDescription