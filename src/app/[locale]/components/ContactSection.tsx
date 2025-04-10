import {
  Mail,
  Phone,
  Github,
  Globe,
  MapPin,
} from "lucide-react";

type ContactSectionProps = {
  contact: ContactInfo;
};

function ContactItem({
  icon: Icon,
  value,
  href,
}: {
  icon: React.ElementType;
  value: string;
  href?: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-600" />
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </li>
  );
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <ul className="space-y-2 text-sm text-gray-700">
      {contact.email && (
        <ContactItem
          icon={Mail}
          value={contact.email}
          href={`mailto:${contact.email}`}
        />
      )}
      {contact.phone && (
        <ContactItem icon={Phone} value={contact.phone} />
      )}
      {contact.github && (
        <ContactItem
          icon={Github}
          value={contact.github}
          href={contact.github}
        />
      )}
      {contact.website && (
        <ContactItem
          icon={Globe}
          value={contact.website}
          href={contact.website}
        />
      )}
      {contact.location && (
        <ContactItem icon={MapPin} value={contact.location} />
      )}
    </ul>
  );
}
