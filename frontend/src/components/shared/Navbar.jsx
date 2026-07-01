import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase, mapUser } from '@/lib/supabase'
import { setUser } from '@/redux/authSlice'
import { LogOut, User as User2, Menu, X, Briefcase, Bell, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const { darkMode, toggleDarkMode } = useTheme()

    const logoutHandler = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            dispatch(setUser(null))
            navigate('/')
            toast.success('Logged out successfully')
        } catch (error) {
            toast.error(error.message || 'Logout failed')
        }
    }

    const isActive = (path) => location.pathname === path

    const navLinks = user && user.role === 'recruiter'
        ? [
            { path: '/admin/dashboard', label: 'Dashboard' },
            { path: '/admin/companies', label: 'Companies' },
            { path: '/admin/jobs', label: 'Jobs' },
        ]
        : [
            { path: '/', label: 'Home' },
            { path: '/jobs', label: 'Jobs' },
            { path: '/browse', label: 'Browse' },
        ]

    return (
        <header className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2 shrink-0'>
                        <div className='w-8 h-8 bg-[#6A38C2] rounded-lg flex items-center justify-center'>
                            <Briefcase className='w-4 h-4 text-white' />
                        </div>
                        <span className='text-xl font-bold text-gray-900 dark:text-white'>
                            Job<span className='text-[#6A38C2]'>Portal</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className='hidden md:flex items-center gap-1'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive(link.path)
                                        ? 'bg-[#6A38C2]/10 text-[#6A38C2] dark:bg-[#6A38C2]/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className='hidden md:flex items-center gap-2'>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            aria-label='Toggle dark mode'
                            className='w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                        >
                            {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
                        </button>

                        {!user ? (
                            <>
                                <Link
                                    to='/login'
                                    className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to='/signup'
                                    className='px-4 py-2 bg-[#6A38C2] text-white text-sm font-semibold rounded-lg hover:bg-[#5b30a6] transition-colors shadow-sm'
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <button
                                    aria-label='Notifications'
                                    className='w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors'
                                >
                                    <Bell className='w-4 h-4' />
                                </button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className='flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 transition-colors'>
                                            <Avatar className='h-7 w-7'>
                                                <AvatarImage src={user.profile && user.profile.profilePhoto} />
                                                <AvatarFallback className='bg-[#6A38C2] text-white text-xs font-bold'>
                                                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className='text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate'>
                                                {user.fullname}
                                            </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className='w-64 p-0 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800'
                                        align='end'
                                        sideOffset={8}
                                    >
                                        {/* Profile Header */}
                                        <div className='p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-[#6A38C2]/5 to-transparent dark:from-[#6A38C2]/10'>
                                            <div className='flex items-center gap-3'>
                                                <Avatar className='h-10 w-10'>
                                                    <AvatarImage src={user.profile && user.profile.profilePhoto} />
                                                    <AvatarFallback className='bg-[#6A38C2] text-white font-bold'>
                                                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='min-w-0'>
                                                    <p className='font-semibold text-gray-900 dark:text-white text-sm truncate'>{user.fullname}</p>
                                                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{user.email}</p>
                                                    <span className='inline-block mt-1 text-xs bg-[#6A38C2]/10 dark:bg-[#6A38C2]/20 text-[#6A38C2] px-2 py-0.5 rounded-full font-medium capitalize'>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className='p-2'>
                                            {user.role === 'recruiter' && (
                                                <Link
                                                    to='/admin/dashboard'
                                                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group'
                                                >
                                                    <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-[#6A38C2]/10 dark:group-hover:bg-[#6A38C2]/20 transition-colors'>
                                                        <LayoutDashboard className='w-4 h-4 group-hover:text-[#6A38C2] transition-colors' />
                                                    </div>
                                                    <span className='text-sm font-medium'>Dashboard</span>
                                                </Link>
                                            )}
                                            {user.role === 'student' && (
                                                <Link
                                                    to='/profile'
                                                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group'
                                                >
                                                    <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-[#6A38C2]/10 dark:group-hover:bg-[#6A38C2]/20 transition-colors'>
                                                        <User2 className='w-4 h-4 group-hover:text-[#6A38C2] transition-colors' />
                                                    </div>
                                                    <span className='text-sm font-medium'>My Profile</span>
                                                </Link>
                                            )}
                                            <div className='my-1 border-t border-gray-100 dark:border-gray-700' />
                                            <button
                                                onClick={logoutHandler}
                                                className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group'
                                            >
                                                <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors'>
                                                    <LogOut className='w-4 h-4 group-hover:text-red-500 transition-colors' />
                                                </div>
                                                <span className='text-sm font-medium'>Sign Out</span>
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>

                    {/* Mobile: dark mode + hamburger */}
                    <div className='md:hidden flex items-center gap-2'>
                        <button
                            onClick={toggleDarkMode}
                            className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400'
                        >
                            {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
                        </button>
                        <button
                            className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label='Toggle menu'
                        >
                            {menuOpen ? <X className='w-5 h-5 text-gray-700 dark:text-gray-300' /> : <Menu className='w-5 h-5 text-gray-700 dark:text-gray-300' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className='md:hidden border-t border-gray-100 dark:border-gray-800 py-3 bg-white dark:bg-gray-900'>
                        <div className='space-y-1 mb-3'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        isActive(link.path)
                                            ? 'bg-[#6A38C2]/10 text-[#6A38C2]'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        {!user ? (
                            <div className='flex gap-2 px-1'>
                                <Link
                                    to='/login'
                                    onClick={() => setMenuOpen(false)}
                                    className='flex-1 text-center py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300'
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to='/signup'
                                    onClick={() => setMenuOpen(false)}
                                    className='flex-1 text-center py-2 bg-[#6A38C2] text-white rounded-lg text-sm font-medium'
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className='border-t border-gray-100 dark:border-gray-800 pt-3 mt-2 px-1 space-y-1'>
                                {user.role === 'student' && (
                                    <Link
                                        to='/profile'
                                        onClick={() => setMenuOpen(false)}
                                        className='flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800'
                                    >
                                        <User2 className='w-4 h-4' /> My Profile
                                    </Link>
                                )}
                                {user.role === 'recruiter' && (
                                    <Link
                                        to='/admin/dashboard'
                                        onClick={() => setMenuOpen(false)}
                                        className='flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800'
                                    >
                                        <LayoutDashboard className='w-4 h-4' /> Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => { logoutHandler(); setMenuOpen(false) }}
                                    className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20'
                                >
                                    <LogOut className='w-4 h-4' /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar
