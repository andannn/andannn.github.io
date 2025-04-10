import { getSortedPostsByTag, getSortedPostsdata } from '@/src/lib/posts/posts'
import React from 'react'
import PostList from '../../components/PostList'

export function generateStaticParams() {
    const posts = getSortedPostsdata()

    const tags = new Set(posts.map((post) => post.tags).flat())
    return Array.from(tags).map((tag) => ({
        tagId: tag
    }))
}

export function generateMetadata({ params }: { params: { tagId: string } }) {
    const tagName = params.tagId

    return {
        title: `Tag: ${tagName}`,
    }
}

export default function TagContents({ params }: { params: { tagId: string, locale: string } }) {
    const tagName = params.tagId
    const posts = getSortedPostsByTag(tagName)
    return (
        <main className="px-6 mx-auto">
            <PostList title={`Tag: ${tagName}`} posts={posts} locale={params.locale} />
        </main>
    )
}
