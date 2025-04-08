type HeaderProps = {
    name: string
    title: string
    summary: string
    avatarUrl: string
}

export default function HeaderSection({ name, title, summary, avatarUrl }: HeaderProps) {
  return (
    <header className="bg-white p-4 mb-6">
      <div className="flex items-start gap-4">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border border-gray-200"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="text-lg text-gray-700 mt-1">{title}</p>
          <p className="text-sm text-gray-600 mt-3">{summary}</p>
        </div>
      </div>
    </header>
  )
}
