import getSortedPostsdata from '@/lib/posts'
import React, { useEffect } from 'react'

export default function Posts() {
    const posts = getSortedPostsdata()
    return (
        <section>
            <h2>Blog</h2>
            <ul>
                {posts.map(post => {
                    return (
                        <>
                            <a>
                                {post.title}
                            </a>
                            <br />
                        </>
                    )
                })}
            </ul>
        </section>
    )
}
