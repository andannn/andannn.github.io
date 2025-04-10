import { Link } from '@/src/i18n/navigation';
import React from 'react'

type Props = {
    tag: TagWithCount,
    locale: string,
}

type HighlightLevel = 'small' | 'normal' | 'large' | 'exLarge';

export default function TagItem({ tag, locale }: Props) {
    const level = getHighLightLevelOfTag(tag)
    const content = tag.tag

    let tagClass: string;
    switch (level) {
        case 'small':
            tagClass = 'text-lg text-slate-300';
            break;
        case 'normal':
            tagClass = 'text-xg text-slate-200';
            break;
        case 'large':
            tagClass = 'text-2xl text-slate-100';
            break;
        case 'exLarge':
            tagClass = 'text-3xl text-white';
            break;
    }
   return (
        <Link className={`rounded mx-4 my-5 underline ${tagClass}`} locale={locale} href={`/tags/${content}`}>
            {content}
        </Link>
    );
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