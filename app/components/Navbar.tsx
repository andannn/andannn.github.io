import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    return (
        <nav className='bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10'>
            <div className='prose prose-xl mx-16 flex justfy-between flex-col sm:flex-row'>
                <Link href={"/"} className='text-white/90 no-underline hover:text-white'>Andannns Blog</Link>
            </div>
        </nav>
    )
}
