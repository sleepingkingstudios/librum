export interface Theme {
  background?: string;
  header: string;
  headerBase?: string;
  headerDanger: string;
  hr: string;
  hrBase?: string;
  hrMuted: string;
  link: string;
  linkBase?: string;
  linkDanger: string;
  name: string;
  subtitle: string;
  text: string;
  textAccent: string;
  textBase?: string;
  textDanger: string;
  textHeading: string;
  textMuted: string;
  textStrong: string;
  title: string;
}

export const defaultTheme = {
  header: '@headerBase',
  headerDanger: '@headerBase',
  hr: '@hrBase',
  hrMuted: '@hrBase',
  link: '@linkBase',
  linkDanger: '@linkBase',
  name: 'Default Theme',
  subtitle: '@headerBase',
  text: '@textBase',
  textAccent: '@textBase',
  textDanger: '@textBase',
  textHeading: '@textBase',
  textStrong: '@textBase',
  textMuted: '@textBase',
  title: '@headerBase',
}
