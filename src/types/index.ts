export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

export type BasicResponse = {
  status: 'ok' | 'error';
  message?: string;
};
