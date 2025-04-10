import { Link } from '@/src/i18n/navigation'
import React from 'react'

type Props = {
    tag: TagWithCount
    locale: string
}

type HighlightLevel = 'small' | 'normal' | 'large' | 'exLarge'

export default function TagItem({ tag, locale }: Props) {
    const level = getHighLightLevelOfTag(tag)
    const content = tag.tag

    let tagClass: string
    switch (level) {
        case 'small':
            tagClass = 'text-sm bg-slate-700 hover:bg-slate-600 text-slate-300'
            break
        case 'normal':
            tagClass = 'text-base bg-slate-600 hover:bg-slate-500 text-slate-200'
            break
        case 'large':
            tagClass = 'text-lg bg-slate-500 hover:bg-slate-400 text-white'
            break
        case 'exLarge':
            tagClass = 'text-xl font-bold bg-blue-600 hover:bg-blue-500 text-white'
            break
    }

    return (
        <Link
            locale={locale}
            href={`/tags/${content}`}
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 m-2 transition-colors duration-200 ${tagClass}`}
        >
            {content}
        </Link>
    )
}

function getHighLightLevelOfTag(tag: TagWithCount): HighlightLevel {
    const count = tag.count

    if (count < 5) {
        return 'small'
    } else if (count < 10) {
        return 'normal'
    } else if (count < 20) {
        return 'large'
    } else {
        return 'exLarge'
    }
}
