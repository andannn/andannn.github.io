import PostList from "./components/PostList";
import TagArea from "./components/AllTagArea";
import { getSortedPostsdata } from "@/src/lib/posts/posts";


export default async function HomePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const posts = getSortedPostsdata()
    return (
        <main className="px-6 mx-auto">
            <TagArea locale={locale} />
            <PostList locale={locale} posts={posts} />
        </main>
    );
}