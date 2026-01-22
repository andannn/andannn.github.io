'use client'

import { useTranslations } from "next-intl"
import ReactMarkdown from 'react-markdown';

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const t = useTranslations("ResumePage")

    return (
        <div className="bg-white shadow rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
                {project.link ? (
                    <a href={project.link} target="_blank" className="text-blue-600 hover:underline">
                        {project.name}
                    </a>
                ) : (
                    project.name
                )}
            </h3>

            <div className="text-sm text-gray-500">
                {project.role}
                {(project.role) ? (
                    <>
                        <span className="mx-2 text-gray-300">|</span>
                    </>
                ) : null}
                {project.teamSize}
                {(project.teamSize) ? (
                    <>
                        <span className="mx-2 text-gray-300">|</span>
                    </>
                ) : null}
                {(project.startDate) ? (
                    <>
                        {project.startDate} - {project.endDate ?? 'Present'}
                    </>
                ) : null}
            </div>

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {project.description.map((line, i) => (
                    <li key={i}>
                        <ReactMarkdown components={{
                            p: ({ ...props }) => <span {...props} />
                        }}>
                            {line}
                        </ReactMarkdown>
                    </li>
                ))}
            </ul>
            <div className="text-xs text-gray-500">
                {t("techStack")}: {project.techStack?.join(', ')}
            </div>
        </div>
    )
}