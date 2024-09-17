import Link from 'next/link'
import React from 'react'

type Props = {
    post: BlogPost
}

function PostItem({ post }: Props) {
    return (
        <li className="mt-4 text-2xl dark:text-white/90">
            <Link className="underline hover:text-black/70 dark:hover:text-white" href={`/posts/${post.id}`}>{post.title}</Link>
            <br />
            <p className="text-sm mt-1">{post.date.toDateString()}</p>
        </li>
    )
}

export default PostItem