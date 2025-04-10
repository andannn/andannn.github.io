import { getSortedPostsdata } from '@/src/lib/posts/posts'
import React from 'react'
import TagItem from './TagItem'
import { useTranslations } from 'next-intl'

type TagsOfPost = string[]

export default function AllTagArea({ locale }: { locale: string }) {
  const posts = getSortedPostsdata()
  const tagWithCountList = calculateCountOfTag(posts.map(post => post.tags))
  const t = useTranslations('HomePage')

  return (
    <section className="mt-10 mx-auto max-w-4xl px-4">
      {/* Title */}
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 mb-6">
        {t('tag')}
      </h2>

      {/* Tags Wrap */}
      <div className="flex flex-wrap gap-3">
        {tagWithCountList.map((tag) => (
          <TagItem locale={locale} tag={tag} key={tag.tag} />
        ))}
      </div>
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
