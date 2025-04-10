import { Link } from '@/src/i18n/navigation'
import React from 'react'

type Props = {
    post: BlogPost,
    locale: string
}

function PostItem({ post, locale }: Props) {
    return (
        <li className="mt-4 text-2xl dark:text-white/90">
            <Link locale={locale} className="underline hover:text-black/70 dark:hover:text-white" href={`/posts/${post.id}`}>{post.title}</Link>
            <br />
            <p className="text-sm mt-1">{post.date.toDateString()}</p>
        </li>
    )
}

export default PostItem