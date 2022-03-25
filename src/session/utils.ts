import type { Session } from './types';

export const getStoredSession = (): Session => {
  const defaultSession: Session = { authenticated: false };
  const storedValue: string | null = localStorage.getItem('session');

  if (!storedValue) { return defaultSession; }

  try {
    const parsedValue = JSON.parse(storedValue) as Record<string, unknown> | unknown;

    if (!(typeof parsedValue == 'object')) { return defaultSession; }

    if (!('authenticated' in parsedValue)) { return defaultSession; }

    return JSON.parse(storedValue) as Session;
  } catch (error) {
    return defaultSession;
  }
}
