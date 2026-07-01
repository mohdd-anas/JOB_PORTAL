import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAllApplicant } from '@/redux/applicationSlice'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoveVertical as MoreVertical, FileText, CircleCheck as CheckCircle, Circle as XCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application)
    const dispatch = useDispatch()

    const statusHandler = async (status, id) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: status.toLowerCase() })
                .eq('id', id)
            if (error) throw error
            const updated = (applicants || []).map(app =>
                app._id === id ? { ...app, status: status.toLowerCase() } : app
            )
            dispatch(setAllApplicant(updated))
            toast.success('Status updated successfully')
        } catch (error) {
            toast.error(error.message || 'Status update failed')
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            case 'shortlisted': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            default: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        }
    }

    if (!applicants || applicants.length === 0) {
        return (
            <div className='text-center py-12 text-gray-400 dark:text-gray-500'>
                <p className='text-sm'>No applicants yet.</p>
            </div>
        )
    }

    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
                <thead className='bg-gray-50 dark:bg-gray-700/50'>
                    <tr>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Applicant</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Contact</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Resume</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Applied</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Status</th>
                        <th className='text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {applicants.map((item) => (
                        <tr key={item._id} className='hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'>
                            <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-[#6A38C2]/10 dark:bg-[#6A38C2]/20 text-[#6A38C2] flex items-center justify-center text-sm font-bold shrink-0'>
                                        {item.applicant && item.applicant.fullname ? item.applicant.fullname.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-gray-900 dark:text-white'>{item.applicant && item.applicant.fullname}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>{item.applicant && item.applicant.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4 text-gray-600 dark:text-gray-300 text-sm'>
                                {item.applicant && item.applicant.phoneNumber || <span className='text-gray-400'>—</span>}
                            </td>
                            <td className='px-6 py-4'>
                                {item.applicant && item.applicant.profile && item.applicant.profile.resume ? (
                                    <a
                                        href={item.applicant.profile.resume}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex items-center gap-1.5 text-[#6A38C2] hover:underline text-sm font-medium'
                                    >
                                        <FileText className='w-3.5 h-3.5' />
                                        View Resume
                                    </a>
                                ) : (
                                    <span className='text-gray-400 text-sm'>Not uploaded</span>
                                )}
                            </td>
                            <td className='px-6 py-4 text-gray-500 dark:text-gray-400 text-sm'>
                                {item.createdAt ? item.createdAt.split('T')[0] : '—'}
                            </td>
                            <td className='px-6 py-4'>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                                    {item.status === 'accepted' && <CheckCircle className='w-3 h-3' />}
                                    {item.status === 'rejected' && <XCircle className='w-3 h-3' />}
                                    {(!item.status || item.status === 'pending') && <Clock className='w-3 h-3' />}
                                    {item.status ? item.status.toUpperCase() : 'PENDING'}
                                </span>
                            </td>
                            <td className='px-6 py-4 text-right'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'>
                                            <MoreVertical className='w-4 h-4' />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-44 p-1 shadow-lg' align='end'>
                                        <button
                                            onClick={() => statusHandler('Accepted', item._id)}
                                            className='w-full flex items-center gap-2 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors'
                                        >
                                            <CheckCircle className='w-4 h-4' />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => statusHandler('Rejected', item._id)}
                                            className='w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                                        >
                                            <XCircle className='w-4 h-4' />
                                            Reject
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApplicantsTable
