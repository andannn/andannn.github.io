import PostList from "./components/PostList";
import TagArea from "./components/AllTagArea";

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <TagArea />
      <PostList />
    </main>
  );
}
