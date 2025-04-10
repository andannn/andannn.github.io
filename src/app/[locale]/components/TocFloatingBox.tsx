'use client'

import React, { useEffect, useState } from 'react'

type Heading = {
  id: string
  text: string
  level: 2 | 3 | 4
}

export default function TocFloatingBox() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const selector = 'article :is(h2, h3, h4)'
    const els = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

    const newHeadings: Heading[] = els.map((el) => {
      const text = el.textContent || ''
      let id = el.id
      if (!id) {
        id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        el.setAttribute('id', id)
      }

      const level = parseInt(el.tagName[1]) as 2 | 3 | 4

      return { id, text, level }
    })

    setHeadings(newHeadings)

    // --- Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          const topMost = visible.sort((a, b) => {
            return (a.boundingClientRect.top || 0) - (b.boundingClientRect.top || 0)
          })[0]
          if (topMost?.target) {
            setActiveId((topMost.target as HTMLElement).id)
          }
        }
      },
      {
        rootMargin: '0px 0px -60% 0px', // 提前触发一点
        threshold: 0.1,
      }
    )

    els.forEach((el) => observer.observe(el))

    return () => {
      els.forEach((el) => observer.unobserve(el))
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block fixed top-28 right-10 w-64 p-4 rounded-xl bg-white/70 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-md text-sm max-h-[80vh] overflow-auto">
      <h2 className="text-base font-bold mb-3 text-slate-700 dark:text-white">目录</h2>
      <ul className="space-y-1">
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          const indent =
            heading.level === 2
              ? ''
              : heading.level === 3
              ? 'ml-4'
              : 'ml-8'
          const font = heading.level === 2 ? 'font-medium' : heading.level === 3 ? 'text-sm' : 'text-xs'

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block ${indent} ${font} ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                } hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
