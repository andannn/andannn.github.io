import Link from 'next/link'
import React from 'react'

type Props = {
    title: string
}

export default function Navbar({ title }: Props) {
    return (
        <nav className='bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10'>
            <div className='prose prose-xl mx-16 flex justfy-between flex-col sm:flex-row'>
                <Link href={"/"} className='text-white/90 no-underline hover:text-white'>{title}</Link>
            </div>
        </nav>
    )
}
