type BlogPost = {
    id: string
    title: string
    date: Date
    content: string
}

type BlogPostWithHtml = BlogPost & { contentHtml: string }