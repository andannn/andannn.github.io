import { getPostById } from '@/lib/posts'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({ params }: { params: { postId: string } }) {
    const post = await getPostById(params.postId)
    if (post === undefined) {
        return notFound()
    }
    console.log(post)

    return (
        <main className="px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
            <h1 className="text-3xl mt-4 mb-0">{post.title}</h1>
            <p className="mt-0">
                {post.date.toDateString()}
            </p>
            <article>
                <section dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                <p>
                    <Link href="/">← Back to home</Link>
                </p>
            </article>
        </main>
    )
}
