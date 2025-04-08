'use client'

import ProjectCard from "./ProjectCard"

type ExperienceProps = {
    experience: Experience
    isTimeline: boolean
}

export default function ExperienceCard({
    experience,
    isTimeline
}: ExperienceProps) {
    return (
        <div className="relative pl-2">
            {isTimeline && (
                <>
                    <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" />
                    <span className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-blue-500" />
                </>)
            }

            <div className="pl-4">
                <h3 className="text-xl font-semibold text-gray-800">{experience.company}</h3>
                <div className="text-sm text-gray-600">
                    {experience.title} ｜ {experience.startDate} - {experience.endDate ?? '至今'}
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-700 mt-2">
                    {experience.description.map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>

                {experience.projects?.length ? (
                    <div className="mt-4 space-y-4">
                        {experience.projects.map((p, idx) => (
                            <ProjectCard key={idx} project={p}></ProjectCard>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
