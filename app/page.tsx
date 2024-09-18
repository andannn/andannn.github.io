import PostList from "./components/PostList";
import TagArea from "./components/AllTagArea";
import { getSortedPostsdata } from "@/lib/posts";

export default function Home() {
  const posts = getSortedPostsdata()
  return (
    <main className="px-6 mx-auto">
      <TagArea />
      <PostList title={"Blog"} posts={posts} />
    </main>
  );
}
