import { getContactIcon, isLinkLikeContact } from "@/lib/contactMeta";
import { cn } from "@/lib/utils";
import type { BlockStyle, PersonalInfo } from "@/lib/types";
import type { TemplateTheme } from "@/components/templates/theme";

interface HeaderSectionProps {
  info: PersonalInfo;
  theme: TemplateTheme;
  params?: Record<string, unknown>;
  blockStyle?: BlockStyle;
}

export function HeaderSection({ info, theme, params, blockStyle }: HeaderSectionProps) {
  const showPhoto = Boolean(params?.showPhoto);
  const photoSize = Number(params?.photoSize ?? 96);
  const contactItems =
    info.contacts && info.contacts.length > 0
      ? info.contacts.filter((item) => item.value?.trim())
      : [
          { type: "email", value: info.email },
          { type: "phone", value: info.phone },
          { type: "location", value: info.location },
          ...(info.linkedin ? [{ type: "linkedin", value: info.linkedin }] : []),
          ...(info.github ? [{ type: "github", value: info.github }] : []),
          ...(info.website ? [{ type: "website", value: info.website }] : []),
          ...(info.summary ? [{ type: "summary", value: info.summary }] : []),
        ];

  return (
    <header className={cn("cv-print-header mb-5 flex gap-3", theme.headerClassName)}>
      {showPhoto && info.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={info.photoUrl}
          alt={info.name}
          width={photoSize}
          height={photoSize}
          className={cn("object-cover", blockStyle?.rounded ? "rounded-full" : "rounded-md")}
        />
      ) : null}
      <div className="flex-1">
      <h1 className="text-3xl font-bold">{info.name}</h1>
      <p className={cn("text-lg", theme.textMutedClassName)}>{info.title}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {contactItems.map((item, index) => (
          <span key={`${item.type}-${item.value}-${index}`} className="inline-flex items-center gap-1">
            {getContactIcon(item.type)}
            {isLinkLikeContact(item.type) ? (
              <a href={item.value.startsWith("http") ? item.value : `https://${item.value}`} target="_blank" rel="noreferrer" className={theme.linkClassName}>
                {item.value}
              </a>
            ) : item.type.toLowerCase().includes("summary") ? (
              <span title={item.value}>{item.value.length > 72 ? `${item.value.slice(0, 72)}...` : item.value}</span>
            ) : (
              item.value
            )}
          </span>
        ))}
      </div>
      </div>
    </header>
  );
}
