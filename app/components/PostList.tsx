import { getSortedPostsdata } from '@/lib/posts'
import PostItem from './PostItem'

export default function PostList() {
    const posts = getSortedPostsdata()
    return (
        <section className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Blog</h2>
            <ul className="w-full">
                {posts.map(post => {
                    return (
                        <PostItem post={post} key={post.id} />
                    )
                })}
            </ul>
        </section>
    )
}
