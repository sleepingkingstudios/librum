export type User = {
  email: string;
  id: string;
  role: string;
  slug: string;
  username: string;
};

export type Session = {
  authenticated: boolean;
  token?: string;
  user?: User;
};
