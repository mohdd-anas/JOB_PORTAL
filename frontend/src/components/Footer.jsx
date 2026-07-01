import React, { useState } from 'react'
import { Briefcase, Twitter, Linkedin, Github, Mail, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const Footer = () => {
    const [email, setEmail] = useState('')

    const subscribeHandler = (e) => {
        e.preventDefault()
        if (!email.trim()) { toast.error('Please enter your email'); return }
        toast.success('Subscribed! We\'ll keep you updated.')
        setEmail('')
    }

    const quickLinks = [
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Browse', path: '/browse' },
        { label: 'Profile', path: '/profile' },
    ]

    const companyLinks = ['About Us', 'Careers', 'Blog', 'Press']
    const resourceLinks = ['Help Center', 'Privacy Policy', 'Terms & Conditions', 'Support']

    return (
        <footer className='bg-gray-900 dark:bg-black text-gray-300'>
            {/* Newsletter Section */}
            <div className='border-b border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 py-12'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                        <div className='text-center md:text-left'>
                            <h2 className='text-2xl font-bold text-white mb-2'>Stay in the loop</h2>
                            <p className='text-gray-400 text-sm'>Get the latest job openings delivered to your inbox.</p>
                        </div>
                        <form onSubmit={subscribeHandler} className='flex w-full max-w-md gap-2'>
                            <div className='relative flex-1'>
                                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent'
                                />
                            </div>
                            <button
                                type='submit'
                                className='bg-[#6A38C2] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#5b30a6] transition-colors flex items-center gap-2 shrink-0'
                            >
                                Subscribe
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className='max-w-7xl mx-auto px-4 py-12'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                    {/* Brand */}
                    <div className='col-span-2 md:col-span-1'>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-8 h-8 bg-[#6A38C2] rounded-lg flex items-center justify-center'>
                                <Briefcase className='w-4 h-4 text-white' />
                            </div>
                            <span className='text-xl font-bold text-white'>
                                Job<span className='text-[#6A38C2]'>Portal</span>
                            </span>
                        </div>
                        <p className='text-sm text-gray-400 mb-4 max-w-xs'>
                            Your dream job is just a click away. Connect with top companies and explore thousands of opportunities.
                        </p>
                        <div className='flex items-center gap-3'>
                            <a href='#' className='w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#6A38C2] flex items-center justify-center transition-colors' aria-label='Twitter'>
                                <Twitter className='w-4 h-4' />
                            </a>
                            <a href='#' className='w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#6A38C2] flex items-center justify-center transition-colors' aria-label='LinkedIn'>
                                <Linkedin className='w-4 h-4' />
                            </a>
                            <a href='#' className='w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#6A38C2] flex items-center justify-center transition-colors' aria-label='GitHub'>
                                <Github className='w-4 h-4' />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>Quick Links</h3>
                        <ul className='space-y-2.5'>
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.path} className='text-sm text-gray-400 hover:text-[#6A38C2] transition-colors'>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>Company</h3>
                        <ul className='space-y-2.5'>
                            {companyLinks.map((link) => (
                                <li key={link}>
                                    <a href='#' className='text-sm text-gray-400 hover:text-[#6A38C2] transition-colors'>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className='font-semibold text-white mb-4 text-sm uppercase tracking-wider'>Resources</h3>
                        <ul className='space-y-2.5'>
                            {resourceLinks.map((link) => (
                                <li key={link}>
                                    <a href='#' className='text-sm text-gray-400 hover:text-[#6A38C2] transition-colors'>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 py-6'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-3'>
                        <p className='text-sm text-gray-500'>© 2024 JobPortal. All rights reserved.</p>
                        <p className='text-sm text-gray-500'>Made with care for job seekers everywhere.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
