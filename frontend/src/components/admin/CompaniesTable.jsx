import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2, MoreVertical, Calendar, Globe } from 'lucide-react'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const [filterCompany, setFilterCompany] = useState(companies)
    const navigate = useNavigate()

    useEffect(() => {
        const filtered = companies.filter((company) => {
            if (!searchCompanyByText) return true
            return company.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        })
        setFilterCompany(filtered)
    }, [companies, searchCompanyByText])

    if (filterCompany.length === 0) {
        return (
            <div className='text-center py-12 text-gray-400 dark:text-gray-500'>
                <p className='text-sm'>No companies match your search.</p>
            </div>
        )
    }

    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
                <thead className='bg-gray-50 dark:bg-gray-700/50'>
                    <tr>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Company</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Location</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Website</th>
                        <th className='text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Registered</th>
                        <th className='text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {filterCompany.map((company) => (
                        <tr key={company._id} className='hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'>
                            <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                    <Avatar className='h-10 w-10 rounded-xl'>
                                        <AvatarImage src={company.logo} />
                                        <AvatarFallback className='bg-[#6A38C2]/10 text-[#6A38C2] font-bold rounded-xl'>
                                            {company.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='font-semibold text-gray-900 dark:text-white'>{company.name}</p>
                                        {company.description && (
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-xs truncate'>{company.description}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4 text-gray-600 dark:text-gray-300 text-sm'>
                                {company.location || <span className='text-gray-400'>—</span>}
                            </td>
                            <td className='px-6 py-4'>
                                {company.website ? (
                                    <a
                                        href={company.website}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex items-center gap-1 text-[#6A38C2] hover:underline text-sm'
                                    >
                                        <Globe className='w-3.5 h-3.5' />
                                        Visit
                                    </a>
                                ) : (
                                    <span className='text-gray-400'>—</span>
                                )}
                            </td>
                            <td className='px-6 py-4'>
                                <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs'>
                                    <Calendar className='w-3.5 h-3.5' />
                                    {company.createdAt ? company.createdAt.split('T')[0] : 'N/A'}
                                </div>
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
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            className='w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
                                        >
                                            <Edit2 className='w-4 h-4 text-[#6A38C2]' />
                                            Edit Company
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

export default CompaniesTable
