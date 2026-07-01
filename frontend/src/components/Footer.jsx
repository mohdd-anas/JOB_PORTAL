import React from 'react'

const Footer = () => {
    return (
        <footer className='border-t border-t-gray-200 py-8'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                        <p className='text-sm text-gray-500'>Your dream job is just a click away.</p>
                    </div>
                    <div className='flex items-center gap-6 text-sm text-gray-500'>
                        <span>Privacy Policy</span>
                        <span>Terms & Conditions</span>
                        <span>Support</span>
                    </div>
                </div>
                <div className='border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-400'>
                    © 2024 JobPortal. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer