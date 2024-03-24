import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className='flex justify-between px-10 py-5 font-serif text-gray-200'>
        <h1 className='text-4xl'>IronTheDress</h1>
        <div className="flex space-x-4 justify-center items-center">
            <Link href="#">Home</Link>
            <Link href="#">IronSpace</Link>
        </div>
    </div>
  )
}

export default Header
