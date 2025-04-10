import PostItem from './PostItem'

type Props = {
    posts: BlogPost[]
    locale: string
}

export default function PostList({ posts, locale }: Props) {
    return (
        <section className="mt-10 mx-auto max-w-4xl px-4">
            {/* Post Cards */}
            <ul className="space-y-6">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} locale={locale} />
                ))}
            </ul>
        </section>
    )
}
