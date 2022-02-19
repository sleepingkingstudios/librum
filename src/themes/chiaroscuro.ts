import {
  Theme,
  defaultTheme,
} from './theme';

export const chiaroscuro: Theme = {
  ...defaultTheme,
  background: 'bg-chiaroscuro-background dark:bg-chiaroscuro-background-dark',
  header: '@headerBase text-chiaroscuro-text-strong dark:text-chiaroscuro-text-strong-dark',
  headerBase: 'font-serif',
  hr: 'border-chiaroscuro-text-strong dark:border-chiaroscuro-text-strong-dark after:border-chiaroscuro-text-strong after:dark:border-chiaroscuro-text-strong-dark',
  hrMuted: 'border-chiaroscuro-text-muted after:dark:border-chiaroscuro-text-muted',
  link: '@linkBase text-chiaroscuro-link hover:text-chiaroscuro-link-hover dark:hover:text-chiaroscuro-link-hover-dark',
  linkBase: 'hover:underline',
  linkDanger: '@linkBase text-chiaroscuro-text-danger hover:text-chiaroscuro-text-danger-hover dark:text-chiaroscuro-text-danger-dark dark:hover:text-chiaroscuro-text-danger-hover-dark',
  name: 'Chiaroscuro',
  text: '@textBase text-chiaroscuro-text dark:text-chiaroscuro-text-dark',
  textBase: 'font-sans',
  textDanger: '@textBase text-chiaroscuro-text-danger dark:text-chiaroscuro-text-danger-dark',
  textMuted: '@textBase text-chiaroscuro-text-muted',
};
