import PostItem from './PostItem'

type Props = {
    title: string
    posts: BlogPost[],
    locale: string,
}

export default function PostList({title, posts, locale} : Props) {
    return (
        <section className="mt-6 mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold dark:text-white/90">{title}</h2>
            <ul className="w-full">
                {posts.map(post => {
                    return (
                        <PostItem locale={locale} post={post} key={post.id} />
                    )
                })}
            </ul>
        </section>
    )
}
