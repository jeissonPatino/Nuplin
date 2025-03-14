export interface User {
    id: number;
    email: string;
    displayName: string;
    role: 'Admin' | 'Cliente';
    password: string;
    token?: string;
  }