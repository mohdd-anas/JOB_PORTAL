import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '@/lib/api'
import { toast } from 'sonner'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Upload } from 'lucide-react'

const CompanySetup = () => {
    const params = useParams()
    useGetCompanyById(params.id)
    const { singleCompany } = useSelector(store => store.company)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [input, setInput] = useState({
        name: '', description: '', website: '', location: '', file: null
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const changeFileHandler = (e) => {
        const file = e.target.files && e.target.files[0]
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', input.name)
        formData.append('description', input.description)
        formData.append('website', input.website)
        formData.append('location', input.location)
        if (input.file) formData.append('file', input.file)

        try {
            setLoading(true)
            const res = await api.put(
                `/company/update/${params.id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/admin/companies')
            }
        } catch (error) {
            toast.error(error.response && error.response.data ? error.response.data.message : 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || '',
                description: singleCompany.description || '',
                website: singleCompany.website || '',
                location: singleCompany.location || '',
                file: null
            })
        }
    }, [singleCompany])

    const fields = [
        { name: 'name', label: 'Company Name', placeholder: 'e.g. Acme Corp', icon: Building2 },
        { name: 'location', label: 'Location', placeholder: 'e.g. Bangalore, India', icon: MapPin },
        { name: 'website', label: 'Website URL', placeholder: 'https://yourcompany.com', icon: Globe },
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-2xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-4 mb-8'>
                    <button
                        onClick={() => navigate('/admin/companies')}
                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                    </button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Company Setup</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-0.5'>Update your company information</p>
                    </div>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Basic Info */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-4'>
                        <h2 className='font-semibold text-gray-900 dark:text-white mb-5'>Company Information</h2>
                        <div className='space-y-4'>
                            {fields.map(({ name, label, placeholder, icon: Icon }) => (
                                <div key={name}>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>{label}</label>
                                    <div className='relative'>
                                        <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input
                                            type='text'
                                            name={name}
                                            value={input[name]}
                                            onChange={changeEventHandler}
                                            placeholder={placeholder}
                                            className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>Description</label>
                                <div className='relative'>
                                    <FileText className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                                    <textarea
                                        name='description'
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        rows={3}
                                        placeholder='Brief description of your company...'
                                        className='w-full pl-10 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent resize-none'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6'>
                        <h2 className='font-semibold text-gray-900 dark:text-white mb-4'>Company Logo</h2>
                        {singleCompany && singleCompany.logo && (
                            <div className='flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                                <img
                                    src={singleCompany.logo}
                                    alt='Current logo'
                                    className='w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600'
                                />
                                <div>
                                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Current Logo</p>
                                    <p className='text-xs text-gray-400'>Upload a new one to replace</p>
                                </div>
                            </div>
                        )}
                        <label className='flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#6A38C2] dark:hover:border-[#6A38C2] transition-colors group'>
                            <Upload className='w-5 h-5 text-gray-400 group-hover:text-[#6A38C2] transition-colors' />
                            <span className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#6A38C2] transition-colors'>
                                {input.file ? input.file.name : 'Click to upload logo (PNG, JPG, SVG)'}
                            </span>
                            <input type='file' accept='image/*' onChange={changeFileHandler} className='hidden' />
                        </label>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3.5 bg-[#6A38C2] text-white rounded-xl font-semibold text-sm hover:bg-[#5b30a6] transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2'
                    >
                        {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Saving...</> : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompanySetup
