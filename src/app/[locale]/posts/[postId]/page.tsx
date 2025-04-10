import { Link } from '@/src/i18n/navigation'
import { getPostById, getSortedPostsdata } from '@/src/lib/posts/posts'
import { notFound } from 'next/navigation'
import React from 'react'
import TocFloatingBox from '../../components/TocFloatingBox'

export function generateStaticParams() {
    const posts = getSortedPostsdata()
    return posts.map((post) => ({ postId: post.id }))
}

export function generateMetadata({ params }: { params: { postId: string } }) {
    const posts = getSortedPostsdata()
    const { postId } = params
    const post = posts.find((post) => post.id === postId)

    if (!post) {
        return { title: 'Post Not Found' }
    }

    return { title: post.title }
}

export default async function PostPage({
    params,
}: {
    params: { postId: string; locale: string }
}) {
    const post = await getPostById(params.postId)
    if (!post) {
        return notFound()
    }

    return (
        <main className="px-4 max-w-4xl mx-auto py-12">
            {/* 标题与日期 */}
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {post.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {post.date.toDateString()}
                </p>
            </header>

            {/* 正文内容 */}
            <article
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* 返回链接 */}
            <p className="mt-12">
                <Link
                    locale={params.locale}
                    href="/"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    ← Back to home
                </Link>
            </p>

            <TocFloatingBox />
        </main>
    )
}
