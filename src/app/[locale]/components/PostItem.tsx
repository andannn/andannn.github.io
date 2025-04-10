import { Link } from '@/src/i18n/navigation'
import React from 'react'

type Props = {
  post: BlogPost
  locale: string
}

function PostItem({ post, locale }: Props) {
  return (
    <li className="rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow p-6 space-y-2">
      {/* Title */}
      <Link
        locale={locale}
        href={`/posts/${post.id}`}
        className="block text-xl font-semibold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {post.title}
      </Link>

      {/* Date */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {post.date.toDateString()}
      </p>
    </li>
  )
}

export default PostItem
