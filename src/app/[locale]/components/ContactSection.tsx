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

// URLから https:// や www. を取り除くヘルパー関数
const formatUrlDisplay = (url: string) => {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
};

function ContactItem({
  icon: Icon,
  text,
  href,
}: {
  icon: React.ElementType;
  text: string;
  href?: string;
}) {
  return (
    <li className="flex items-center gap-3">
      {/* アイコンのサイズを少し調整し、縮まないように flex-shrink-0 を追加 */}
      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
      
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined} // tel: や mailto: は _blank にしない
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          // デフォルトはグレー、ホバーで青色＋下線にする（モダンなUI）
          className="text-gray-700 hover:text-blue-600 hover:underline transition-colors break-all"
        >
          {text}
        </a>
      ) : (
        <span className="text-gray-700">{text}</span>
      )}
    </li>
  );
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    // 左側の余白(pl-1)を少し足してアイコンの位置バランスを整える
    <ul className="space-y-3 text-sm"> 
      {contact.location && (
        <ContactItem icon={MapPin} text={contact.location} />
      )}
      
      {contact.email && (
        <ContactItem
          icon={Mail}
          text={contact.email}
          href={`mailto:${contact.email}`}
        />
      )}
      
      {contact.phone && (
        <ContactItem 
            icon={Phone} 
            text={contact.phone} 
            // 数字以外（ハイフンやスペース）を取り除いて tel: リンクにする
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} 
        />
      )}
      
      {contact.github && (
        <ContactItem
          icon={Github}
          // 表示は短く（github.com/...）、リンクはそのまま
          text={formatUrlDisplay(contact.github)}
          href={contact.github}
        />
      )}
      
      {contact.website && (
        <ContactItem
          icon={Globe}
          text={formatUrlDisplay(contact.website)}
          href={contact.website}
        />
      )}
    </ul>
  );
}