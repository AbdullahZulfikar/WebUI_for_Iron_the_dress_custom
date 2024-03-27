"use client"

import React, { useState } from 'react'
import Link from 'next/link'

const Header = () => {
    const [open, isOpen] = useState(false)
    const Toggle = () => {
        isOpen(!open)
    }

    return (
        <nav className='sm:flex sm:justify-between'>
            <div className='flex items-center justify-between sm:px-10 sm:py-15 px-4 py-5 '>
                {/* for sm and large screens */}
                <div className='flex justify-between  font-serif text-gray-200'>
                    <h1 className='text-lg md:text-4xl font-semibold'>IronTheDress</h1>
                </div>

                {/* for mobile nav menu */}
                <div className='sm:hidden'>
                    <button type='button' className='focus:text-gray-400 h-6 w-6' onClick={Toggle} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                            { open?<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            :<path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>}
                            
                        </svg>
                    </button>
                </div>
            </div>

            
                <div className={`px-3  pb-4 space-y-2 sm:block ${open ? 'block' : 'hidden'} sm:justify-center sm:items-center sm:py-10 sm:px-10`}>
                    <Link href="/" className='block font-serif rounded text-white hover:bg-yellow-500 px-2 sm:inline-block sm:px-4'>Home</Link>
                    <Link href="/iron-space" className='block font-serif rounded text-white hover:bg-yellow-500 px-2 sm:inline-block sm:px-4'>IronSpace</Link>
                </div>
            
        </nav>
    )
}

export default Header
