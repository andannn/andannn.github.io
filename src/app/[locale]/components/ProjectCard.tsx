'use client'

import { useTranslations } from "next-intl"

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
                {project.startDate} - {project.endDate ?? 'Present'}
            </div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
                {project.description.map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
            </ul>
            <div className="text-xs text-gray-500">
                {t("techStack")}: {project.techStack?.join(', ')}
            </div>
        </div>
    )
}