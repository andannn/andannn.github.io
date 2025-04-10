import { getSortedPostsByTag, getSortedPostsdata } from '@/src/lib/posts/posts'
import React from 'react'
import PostList from '../../components/PostList'

export function generateStaticParams() {
    const posts = getSortedPostsdata()
    const tags = new Set(posts.map((post) => post.tags).flat())
    return Array.from(tags).map((tag) => ({
        tagId: tag,
    }))
}

export function generateMetadata({ params }: { params: { tagId: string } }) {
    const tagName = params.tagId
    return {
        title: `Tag: ${tagName}`,
    }
}

export default function TagContents({
    params,
}: {
    params: { tagId: string; locale: string }
}) {
    const tagName = params.tagId
    const posts = getSortedPostsByTag(tagName)

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* 标题 */}
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
                #{tagName}
            </h1>

            {/* 内容 */}
            {posts.length > 0 ? (
                <PostList posts={posts} locale={params.locale} />
            ) : (
                <p className="text-slate-600 dark:text-slate-300">No posts found under this tag.</p>
            )}
        </main>
    )
}
