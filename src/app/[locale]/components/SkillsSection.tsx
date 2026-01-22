'use client'

type SkillsProps = {
    skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsProps) {
    return (
        <div className="space-y-6">
            {skills.map((group, idx) => (
                <div key={idx}>
                    <h4 className="font-semibold text-gray-800 mb-2">
                        {group.title}
                    </h4>
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {group.contents.map((item, i) => (
                            <li key={i} className="bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}