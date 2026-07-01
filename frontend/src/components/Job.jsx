import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, IndianRupee, Bookmark } from 'lucide-react'
import MotionCard from './shared/MotionCard'

const Job = ({ job }) => {
    const navigate = useNavigate()

    const daysAgo = (mongodbTime) => {
        const diff = new Date() - new Date(mongodbTime)
        const days = Math.floor(diff / (1000 * 24 * 60 * 60))
        return days === 0 ? 'Today' : `${days}d ago`
    }

    return (
        <MotionCard className='bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-[#6A38C2]/20 transition-all group'>
            {/* Header */}
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-12 w-12 rounded-xl border border-gray-100'>
                        <AvatarImage src={job?.company?.logo} />
                        <AvatarFallback className='bg-[#6A38C2]/10 text-[#6A38C2] font-bold rounded-xl text-lg'>
                            {job?.company?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className='font-semibold text-gray-900'>{job?.company?.name}</h3>
                        <div className='flex items-center gap-1 text-gray-400 text-xs mt-0.5'>
                            <MapPin className='w-3 h-3' />
                            <span>{job?.location || 'India'}</span>
                        </div>
                    </div>
                </div>
                <button className='text-gray-300 hover:text-[#6A38C2] transition-colors'>
                    <Bookmark className='w-5 h-5' />
                </button>
            </div>

            {/* Job Info */}
            <h2 className='font-bold text-gray-800 text-lg mb-1 group-hover:text-[#6A38C2] transition-colors'>
                {job?.title}
            </h2>
            <p className='text-gray-500 text-sm mb-4 line-clamp-2'>{job?.description}</p>

            {/* Tags */}
            <div className='flex flex-wrap gap-2 mb-4'>
                <span className='text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium'>
                    {job?.position} Positions
                </span>
                <span className='text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium'>
                    {job?.jobType}
                </span>
                <span className='text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium flex items-center gap-1'>
                    <IndianRupee className='w-3 h-3' />{job?.salary} LPA
                </span>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-between pt-3 border-t border-gray-50'>
                <span className='text-xs text-gray-400 flex items-center gap-1'>
                    <Clock className='w-3 h-3' />
                    {daysAgo(job?.createdAt)}
                </span>
                <button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className='bg-[#6A38C2] text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-[#5b30a6] transition-colors'
                >
                    View Details
                </button>
            </div>
        </MotionCard>
    )
}

export default Job