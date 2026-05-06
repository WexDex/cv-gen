import {
  FileText,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { DiscordIcon, GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/lib/svgIcons";
import type { ContactType } from "@/lib/types";

export const contactTypeOptions: Array<{ value: ContactType; label: string }> = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "location", label: "Location" },
  { value: "link", label: "Link" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "discord", label: "Discord" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website" },
  { value: "summary", label: "Summary" },
];

export const getContactIcon = (type: string, size = 14) => {
  const key = type.toLowerCase();
  if (key.includes("mail") || key.includes("email")) return <Mail size={size} />;
  if (key.includes("phone") || key.includes("mobile")) return <Phone size={size} />;
  if (key.includes("location") || key.includes("address")) return <MapPin size={size} />;
  if (key.includes("github")) return <GitHubIcon size={size} />;
  if (key.includes("linkedin")) return <LinkedInIcon size={size} />;
  // Dedicated social contact buckets requested by user.
  if (key.includes("discord")) return <DiscordIcon size={size} />;
  if (key.includes("whatsapp")) return <WhatsAppIcon size={size} />;
  if (key.includes("summary")) return <FileText size={size} />;
  if (key.includes("website")) return <Globe size={size} />;
  return <LinkIcon size={size} />;
};

export const isLinkLikeContact = (type: string) => {
  const key = type.toLowerCase();
  return key.includes("website") || key.includes("link") || key.includes("github") || key.includes("linkedin");
};
