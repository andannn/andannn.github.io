'use client'

import { useTranslations } from "next-intl"
import ReactMarkdown from 'react-markdown';
import React from "react"; // Fragment用に必要

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const t = useTranslations("ResumePage")

    // 1. ロジックの分離: 表示したい要素を配列にまとめます
    // filter(Boolean) を使うことで、null/undefined/空文字を自動的に除去します
    const metaItems = [
        project.role,
        project.teamSize,
        project.startDate
            ? `${project.startDate} - ${project.endDate ?? t('present')}` // 2. 'Present'も翻訳対応
            : null
    ].filter(Boolean);

    return (
        <div className="bg-white shadow rounded-lg p-5 border border-gray-100 transition hover:shadow-md">
            {/* ヘッダー部分 */}
            <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                            {project.name}
                        </a>
                    ) : (
                        project.name
                    )}
                </h3>

                {/* メタデータ行（配列を展開してレンダリング） */}
                <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                    {metaItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <span>{item}</span>
                            {/* 最後の要素以外に区切り線を入れる */}
                            {index < metaItems.length - 1 && (
                                <span className="mx-2 text-gray-300">|</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* 本文 */}
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5 mb-4">
                {project.description.map((line, i) => (
                    <li key={i}>
                        <ReactMarkdown
                            components={{
                                // liの中にpが入らないようにする処理
                                p: ({ ...props }) => <span {...props} />,
                                // 太字をしっかり効かせる
                                strong: ({ ...props }) => <strong className="font-semibold text-gray-900" {...props} />
                            }}
                        >
                            {line}
                        </ReactMarkdown>
                    </li>
                ))}
            </ul>

            {/* Tech Stack（少しリッチに見せるため、タグ風のデザインに変更） */}
            {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-400 self-center mr-1">
                        {t("techStack")}:
                    </span>
                    {project.techStack.map((tech, i) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}