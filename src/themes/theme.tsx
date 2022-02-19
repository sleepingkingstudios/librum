export interface Theme {
  background?: string;
  header: string;
  headerBase?: string;
  hr: string;
  hrBase?: string;
  hrMuted: string;
  link: string;
  linkBase?: string;
  linkDanger: string;
  name: string;
  text: string;
  textAccent: string;
  textBase?: string;
  textDanger: string;
  textHeading: string;
  textMuted: string;
  textStrong: string;
}

export const defaultTheme = {
  header: '@headerBase',
  hr: '@hrBase',
  hrMuted: '@hrBase',
  link: '@linkBase',
  linkDanger: '@linkBase',
  name: 'Default Theme',
  text: '@textBase',
  textAccent: '@textBase',
  textDanger: '@textBase',
  textHeading: '@textBase',
  textStrong: '@textBase',
  textMuted: '@textBase',
}
