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
