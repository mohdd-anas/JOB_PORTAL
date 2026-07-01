import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User, Phone, Upload, Briefcase } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({ fullname: '', email: '', phoneNumber: '', password: '', role: '', file: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('fullname', input.fullname)
        formData.append('email', input.email)
        formData.append('phoneNumber', input.phoneNumber)
        formData.append('password', input.password)
        formData.append('role', input.role)
        if (input.file) formData.append('file', input.file)

        try {
            setLoading(true)
            const res = await api.post('/user/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res.data.success) {
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#eef2ff] flex items-center justify-center px-4 py-10'>
            <div className='w-full max-w-md'>
                {/* Logo */}
                <div className='text-center mb-8'>
                    <Link to='/'>
                        <h1 className='text-3xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                    </Link>
                    <p className='text-gray-500 mt-2'>Create your account to get started.</p>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Create Account</h2>

                    <form onSubmit={submitHandler} className='space-y-4'>
                        {/* Full Name */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                            <div className='relative'>
                                <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='text'
                                    name='fullname'
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    placeholder='John Doe'
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition'
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                            <div className='relative'>
                                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='email'
                                    name='email'
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder='you@example.com'
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition'
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                            <div className='relative'>
                                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='text'
                                    name='phoneNumber'
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    placeholder='+91 98765 43210'
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition'
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                            <div className='relative'>
                                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='password'
                                    name='password'
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder='Create a strong password'
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition'
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-3'>I am a</label>
                            <div className='grid grid-cols-2 gap-3'>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${input.role === 'student' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]' : 'border-gray-200 text-gray-600'}`}>
                                    <input type='radio' name='role' value='student' checked={input.role === 'student'} onChange={changeEventHandler} className='hidden' />
                                    <Briefcase className='w-4 h-4' />
                                    <span className='font-medium text-sm'>Student</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${input.role === 'recruiter' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]' : 'border-gray-200 text-gray-600'}`}>
                                    <input type='radio' name='role' value='recruiter' checked={input.role === 'recruiter'} onChange={changeEventHandler} className='hidden' />
                                    <Briefcase className='w-4 h-4' />
                                    <span className='font-medium text-sm'>Recruiter</span>
                                </label>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Photo</label>
                            <label className='flex items-center gap-3 w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#6A38C2] transition-colors'>
                                <Upload className='w-4 h-4 text-gray-400' />
                                <span className='text-sm text-gray-500'>
                                    {input.file ? input.file.name : 'Click to upload photo'}
                                </span>
                                <input type='file' accept='image/*' onChange={changeFileHandler} className='hidden' />
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-[#6A38C2] text-white py-3 rounded-xl font-semibold hover:bg-[#5b30a6] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2'
                        >
                            {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Please wait...</> : 'Create Account'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-gray-500 mt-6'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-[#6A38C2] font-semibold hover:underline'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup