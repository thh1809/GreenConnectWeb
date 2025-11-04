import { del, get, post, put } from './client';

export const users = {
  getAll: () => get<{ id: number; name: string }[]>('/users'),
  getById: (id: number) => get<{ id: number; name: string }>(`/users/${id}`),
  create: (data: { name: string }) => post<{ id: number }>(`/users`, data),
  update: (id: number, data: Partial<{ name: string }>) =>
    put(`/users/${id}`, data),
  delete: (id: number) => del(`/users/${id}`),
};
