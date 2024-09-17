import PostList from "./components/PostList";
import TagArea from "./components/TagArea";

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
      </p>

      <TagArea />
      <PostList />
    </main>
  );
}
