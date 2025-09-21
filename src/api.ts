export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export const API_URL = 'https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}