import { Link } from '@/src/i18n/navigation'
import React from 'react'

type Props = {
  title: string
  locale: string
}

export default function Navbar({ title, locale }: Props) {
  return (
    <nav className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo / Title */}
        <Link
          locale={locale}
          href="/"
          className="text-xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {title}
        </Link>

        {/* Optional Navigation Links */}
        <div className="hidden sm:flex space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            locale={locale}
            href="/resume"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
