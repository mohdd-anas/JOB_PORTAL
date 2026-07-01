import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { ArrowLeft, Loader as Loader2, Briefcase, MapPin, DollarSign, Users, Clock, Code } from 'lucide-react'
import PageTransition from '../shared/PageTransition'

const PostJob = () => {
    useGetAllCompanies()
    const [input, setInput] = useState({
        title: '', description: '', requirements: '',
        salary: '', location: '', jobType: '',
        experience: '', position: '', companyId: ''
    })
    const [loading, setLoading] = useState(false)
    const { companies } = useSelector(store => store.company)
    const navigate = useNavigate()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find(c => c.name.toLowerCase() === value)
        if (selectedCompany) setInput({ ...input, companyId: selectedCompany._id })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!input.companyId) { toast.error('Please select a company'); return }
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { toast.error('You must be logged in'); return }
            const requirementsArray = input.requirements
                .split(',')
                .map(r => r.trim())
                .filter(Boolean)
            const { error } = await supabase
                .from('jobs')
                .insert({
                    title: input.title,
                    description: input.description,
                    requirements: requirementsArray,
                    salary: Number(input.salary),
                    experience_level: Number(input.experience),
                    location: input.location,
                    job_type: input.jobType,
                    position: Number(input.position),
                    company_id: input.companyId,
                    created_by: session.user.id
                })
                .select()
                .single()
            if (error) throw error
            toast.success('Job posted successfully')
            navigate('/admin/jobs')
        } catch (error) {
            toast.error(error.message || 'Failed to post job')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: 'title', label: 'Job Title', placeholder: 'e.g. Senior Frontend Developer', icon: Briefcase, type: 'text', required: true },
        { name: 'location', label: 'Location', placeholder: 'e.g. Bangalore, Remote', icon: MapPin, type: 'text', required: true },
        { name: 'salary', label: 'Salary (LPA)', placeholder: 'e.g. 12', icon: DollarSign, type: 'number', required: true },
        { name: 'position', label: 'Open Positions', placeholder: 'e.g. 3', icon: Users, type: 'number', required: true },
        { name: 'experience', label: 'Experience Required (years)', placeholder: 'e.g. 2', icon: Clock, type: 'number', required: true },
        { name: 'jobType', label: 'Job Type', placeholder: 'e.g. Full Time, Remote', icon: Briefcase, type: 'text', required: true },
    ]

    return (
        <PageTransition>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-3xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-4 mb-8'>
                    <button
                        onClick={() => navigate('/admin/jobs')}
                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                    </button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Post New Job</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-0.5'>Fill in the details to create a job listing</p>
                    </div>
                </div>

                {companies.length === 0 && (
                    <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3'>
                        <div className='w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0'>⚠️</div>
                        <div>
                            <p className='text-sm font-semibold text-amber-800 dark:text-amber-300'>No company registered</p>
                            <p className='text-xs text-amber-600 dark:text-amber-400 mt-0.5'>
                                You need to register a company before posting jobs.{' '}
                                <button
                                    onClick={() => navigate('/admin/companies/create')}
                                    className='underline font-semibold'
                                >
                                    Register now
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-4'>
                        <h2 className='font-semibold text-gray-900 dark:text-white mb-4'>Basic Information</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {fields.map(({ name, label, placeholder, icon: Icon, type, required }) => (
                                <div key={name}>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                        {label} {required && <span className='text-red-500'>*</span>}
                                    </label>
                                    <div className='relative'>
                                        <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input
                                            type={type}
                                            name={name}
                                            value={input[name]}
                                            onChange={changeEventHandler}
                                            placeholder={placeholder}
                                            required={required}
                                            className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Company Select */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                    Company <span className='text-red-500'>*</span>
                                </label>
                                <Select onValueChange={selectChangeHandler} disabled={companies.length === 0}>
                                    <SelectTrigger className='bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'>
                                        <SelectValue placeholder={companies.length === 0 ? 'No companies found' : 'Select company'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-4'>
                        <h2 className='font-semibold text-gray-900 dark:text-white mb-4'>Job Details</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                    Job Description <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    name='description'
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    rows={4}
                                    placeholder='Describe the role, responsibilities, and what a day looks like...'
                                    required
                                    className='w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent resize-none'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                    Requirements <span className='text-red-500'>*</span>
                                    <span className='text-gray-400 font-normal ml-1'>(comma-separated)</span>
                                </label>
                                <div className='relative'>
                                    <Code className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                                    <textarea
                                        name='requirements'
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        rows={3}
                                        placeholder='e.g. React, Node.js, MongoDB, REST APIs, Git'
                                        required
                                        className='w-full pl-10 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent resize-none'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={loading || companies.length === 0}
                        className='w-full py-3.5 bg-[#6A38C2] text-white rounded-xl font-semibold text-sm hover:bg-[#5b30a6] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Posting...</> : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
        </PageTransition>
    )
}

export default PostJob
