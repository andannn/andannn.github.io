import { Link } from '@/src/i18n/navigation'
import React from 'react'

type Props = {
    title: string,
    locale: string,
}

export default function Navbar({ title, locale }: Props) {
    return (
        <nav className='bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10'>
            <div className='prose prose-xl mx-16 flex justfy-between flex-col sm:flex-row'>
                <Link locale={locale} href={"/"} className='text-white/90 no-underline hover:text-white'>{title}</Link>
            </div>
        </nav>
    )
}
