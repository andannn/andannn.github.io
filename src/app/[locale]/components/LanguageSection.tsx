
type LanguageSectionProps = {
  languages: string[]
}

export default function LanguageSection({ languages }: LanguageSectionProps) {
  return (
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {languages.map((lang, idx) => (
        <li key={idx}>{lang}</li>
      ))}
    </ul>
  )
}
