
type ContactSectionProps = {
  contact: ContactInfo
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <ul className="space-y-2 text-sm text-gray-700">
      {contact.email && (
        <li>
          <span className="font-semibold">Email：</span>
          <a href={`mailto:${contact.email}`} className="text-blue-600 underline">
            {contact.email}
          </a>
        </li>
      )}
      {contact.phone && (
        <li>
          <span className="font-semibold">电话：</span>{contact.phone}
        </li>
      )}
      {contact.github && (
        <li>
          <span className="font-semibold">GitHub：</span>
          <a href={contact.github} target="_blank" className="text-blue-600 underline">
            {contact.github}
          </a>
        </li>
      )}
      {contact.website && (
        <li>
          <span className="font-semibold">网站：</span>
          <a href={contact.website} target="_blank" className="text-blue-600 underline">
            {contact.website}
          </a>
        </li>
      )}
      {contact.location && (
        <li>
          <span className="font-semibold">所在地：</span>{contact.location}
        </li>
      )}
    </ul>
  )
}
