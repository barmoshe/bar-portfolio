// Contact info item interface
export interface ContactInfoItem {
  type: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

// Contact info data
export const contactInfoData: ContactInfoItem[] = [
  {
    type: "email",
    label: "Email",
    value: "1barmoshe1@gmail.com",
    href: "mailto:1barmoshe1@gmail.com",
  },
  {
    type: "phone",
    label: "Phone",
    value: "+972-54-656-1465",
    href: "tel:+972546561465",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/barmoshe",
    href: "https://linkedin.com/in/barmoshe",
    external: true,
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/barmoshe",
    href: "https://github.com/barmoshe",
    external: true,
  },
];
