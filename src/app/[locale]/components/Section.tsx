
type SectionProps = {
    title: string
    children: React.ReactNode
}

export default function Section({ title, children }: SectionProps) {
    return (
        <section className="bg-white bg-neutral-100 rounded-2xl p-4 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </section>
    )
}
