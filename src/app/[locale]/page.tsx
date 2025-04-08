import PostList from "./components/PostList";
import TagArea from "./components/AllTagArea";
import { getSortedPostsdata } from "@/src/lib/posts/posts";


export default function HomePage() {
    const posts = getSortedPostsdata()
    return (
        <main className="px-6 mx-auto">
            <TagArea />
            <PostList title={"Blog"} posts={posts} />
        </main>
    );
}