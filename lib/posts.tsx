import path from "path";
import fs from 'fs';
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), 'post')

export default function getSortedPostsdata() {
    const postDirs = fs.readdirSync(postsDirectory);
    const posts = postDirs.map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const matterResult = matter(fileContents);

        const post: BlogPost = {
            id: fileName.replace(/\.md$/, ''),
            title: matterResult.data['title'],
            date: new Date(matterResult.data['date']),
            content: 'matterResult.content'
        }

        return post
    })

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}
