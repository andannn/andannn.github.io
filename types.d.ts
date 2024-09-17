type BlogPost = {
    id: string
    title: string
    date: Date
    content: string
    tags: string[]
}

type BlogPostWithHtml = BlogPost & { contentHtml: string }