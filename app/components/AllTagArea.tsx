import { getSortedPostsdata } from '@/lib/posts'
import React from 'react'
import TagItem from './TagItem'
import { count } from 'console'

type TagsOfPost = string[]



export default function AllTagArea() {
    const posts = getSortedPostsdata()
    const tagWithCountList = calculateCountOfTag(posts.map(post => post.tags))
    console.log(tagWithCountList)
    return (
        <section className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Tag</h2>
            <div className='wrap-layout mt-6'>{
                tagWithCountList.map(tag => {
                    return <TagItem tag={tag} />
                })
            }</div>
        </section>
    )
}

function calculateCountOfTag(postTagsList: TagsOfPost[]): TagWithCount[] {
    const countMap = new Map<string, number>()

    postTagsList.flat().forEach(tag => {
        const currentCount = countMap.get(tag) || 0;
        countMap.set(tag, currentCount + 1);
    })

    return Array.from(countMap.entries()).map(entry => {
        const [tag, count] = entry
        return {
            tag: tag,
            count: count
        }
    })
}
