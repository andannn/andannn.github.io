'use client'

type SkillsProps = {
    skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {skills.map((group, idx) => (
                <div key={idx}>
                    <h4 className="font-semibold text-gray-800 mb-1">{group.title}</h4>
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {group.contents.map((item, i) => (
                            <li key={i} className="bg-gray-100 px-2 py-1 rounded-md">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}