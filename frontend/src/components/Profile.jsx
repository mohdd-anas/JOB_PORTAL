import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Mail, Phone, FileText, Pen } from 'lucide-react'
import PageTransition from './shared/PageTransition'

const Profile = () => {
    useGetAppliedJobs()
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)

    const resume = user && user.profile && user.profile.resume
    const resumeName = user && user.profile && user.profile.resumeOriginalName
    const profilePhoto = user && user.profile && user.profile.profilePhoto
    const bio = user && user.profile && user.profile.bio
    const skills = user && user.profile && user.profile.skills

    return (
        <PageTransition>
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-5xl mx-auto px-4 py-10'>
                <div className='bg-white rounded-2xl shadow-sm overflow-hidden mb-6'>
                    <div className='h-32 bg-gradient-to-r from-[#6A38C2] to-[#9b59b6]' />
                    <div className='px-8 pb-8'>
                        <div className='flex items-end justify-between -mt-12 mb-6'>
                            <Avatar className='h-24 w-24 border-4 border-white shadow-md'>
                                <AvatarImage src={profilePhoto} alt='profile' />
                                <AvatarFallback className='bg-[#6A38C2] text-white text-3xl font-bold'>
                                    {user ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => setOpen(true)}
                                className='flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                            >
                                <Pen className='w-4 h-4' />
                                Edit Profile
                            </button>
                        </div>

                        <h1 className='text-2xl font-bold text-gray-900'>{user ? user.fullname : ''}</h1>
                        {bio && <p className='text-gray-500 mt-1'>{bio}</p>}

                        <div className='flex flex-wrap gap-4 mt-4'>
                            <span className='flex items-center gap-2 text-sm text-gray-500'>
                                <Mail className='w-4 h-4 text-[#6A38C2]' />
                                {user ? user.email : ''}
                            </span>
                            <span className='flex items-center gap-2 text-sm text-gray-500'>
                                <Phone className='w-4 h-4 text-[#6A38C2]' />
                                {user ? user.phoneNumber : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='space-y-4'>
                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            <h3 className='font-bold text-gray-900 mb-4'>Skills</h3>
                            <div className='flex flex-wrap gap-2'>
                                {skills && skills.length > 0
                                    ? skills.map((skill, index) => (
                                        <Badge key={index} className='bg-[#6A38C2]/10 text-[#6A38C2] border-0 font-medium'>
                                            {skill}
                                        </Badge>
                                    ))
                                    : <p className='text-sm text-gray-400'>No skills added yet.</p>
                                }
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            <h3 className='font-bold text-gray-900 mb-4'>Resume</h3>
                            {resume ? (
                                <a
                                    href={resume}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#6A38C2] transition-colors group'
                                >
                                    <div className='w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center'>
                                        <FileText className='w-5 h-5 text-red-500' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-gray-700 group-hover:text-[#6A38C2] transition-colors'>
                                            {resumeName}
                                        </p>
                                        <p className='text-xs text-gray-400'>Click to view</p>
                                    </div>
                                </a>
                            ) : (
                                <p className='text-sm text-gray-400'>No resume uploaded yet.</p>
                            )}
                        </div>
                    </div>

                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-2xl p-6 shadow-sm'>
                            <h3 className='font-bold text-gray-900 mb-4'>Applied Jobs</h3>
                            <AppliedJobTable />
                        </div>
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
        </PageTransition>
    )
}

export default Profile