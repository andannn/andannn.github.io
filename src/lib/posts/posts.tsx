import path from "path";
import fs from 'fs';
import matter from "gray-matter";
import { remark } from 'remark'
import gfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const postsDirectory = path.join(process.cwd(), 'post')

export function getSortedPostsdata() {
    const files = fs.readdirSync(postsDirectory);
    const posts = files.map(getBlogPost)

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}

export function getSortedPostsByTag(tag: string) {
    const files = fs.readdirSync(postsDirectory);
    const posts = files.map(getBlogPost).filter(post => post.tags.includes(tag))

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}

export async function getPostById(id: string): Promise<BlogPostWithHtml | undefined> {
    const files = fs.readdirSync(postsDirectory);

    const findResult = files.find(fileName => fileName.startsWith(id))
    if (findResult === undefined) {
        return undefined
    }
    const post = getBlogPost(findResult)
    const processedContent = await remark()
        .use(gfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypePrettyCode, {
            theme: 'github-dark', // 可选：'github-light'、'github-dark-dimmed' 等
            onVisitLine(node) {
                // 保证每一行都有 <span> 包裹，方便 lineNumber 支持
                if (node.children.length === 0) {
                    node.children = [{ type: 'text', value: ' ' }]
                }
            },
        })
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(post.content)

    const contentHtml = processedContent.toString()
    return {
        ...post,
        contentHtml
    }
}

function getBlogPost(fileName: string): BlogPost {
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    const tagString = matterResult.data['tag'] as string | undefined
    const tags = tagString?.split('|') ?? []
    const post: BlogPost = {
        id: fileName.replace(/\.md$/, ''),
        title: matterResult.data['title'],
        date: new Date(matterResult.data['date']),
        content: matterResult.content,
        tags: tags
    }

    return post
}
