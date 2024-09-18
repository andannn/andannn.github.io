import { getPostById, getSortedPostsdata } from '@/lib/posts'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export function generateStaticParams() {
    const posts = getSortedPostsdata()

    return posts.map((post) => ({
        postId: post.id
    }))
}

export function generateMetadata({ params }: { params: { postId: string } }) {
    const posts = getSortedPostsdata()
    const { postId } = params

    const post = posts.find(post => post.id === postId)

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.title,
    }
}

export default async function page({ params }: { params: { postId: string } }) {
    const post = await getPostById(params.postId)
    if (post === undefined) {
        return notFound()
    }
    return (
        <main className="px-6 prose max-w-7xl prose-xl prose-slate dark:prose-invert mx-auto">
            <div>
                <h1 className="text-4xl mt-16 mb-0">{post.title}</h1>
                <p className="mt-0">
                    {post.date.toDateString()}
                </p>
            </div>
            <article className='px-6 py-6 bg-slate-700 rounded-2xl'>
                <section dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </article>
            <p className='my-5 mb-20'>
                <Link href="/">← Back to home</Link>
            </p>
        </main>
    )
}
