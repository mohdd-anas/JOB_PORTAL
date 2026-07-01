import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader as Loader2, Mail, Lock, Briefcase } from 'lucide-react'
import { motion } from 'motion/react'
import PageTransition from '../shared/PageTransition'

const Login = () => {
    const [input, setInput] = useState({ email: '', password: '', role: '' })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector(store => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        dispatch(setLoading(true))
        try {
            const res = await api.post('/user/login', input)
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <PageTransition>
        <div className='min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#eef2ff] flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='w-full max-w-md'
            >
                {/* Logo */}
                <div className='text-center mb-8'>
                    <Link to='/'>
                        <h1 className='text-3xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                    </Link>
                    <p className='text-gray-500 mt-2'>Welcome back! Please sign in to continue.</p>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Sign In</h2>

                    <form onSubmit={submitHandler} className='space-y-5'>
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
                                    placeholder='Enter your password'
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent transition'
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-3'>Login As</label>
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

                        {/* Submit */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-[#6A38C2] text-white py-3 rounded-xl font-semibold hover:bg-[#5b30a6] transition-colors flex items-center justify-center gap-2 disabled:opacity-70'
                        >
                            {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Please wait...</> : 'Sign In'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-gray-500 mt-6'>
                        Don't have an account?{' '}
                        <Link to='/signup' className='text-[#6A38C2] font-semibold hover:underline'>Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>
        </PageTransition>
    )
}

export default Login