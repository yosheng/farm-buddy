import request from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export type SignIn = {
  username: string;
  password: string;
};

export type SignInRes = {
  userId: number;
  username: string;
  displayName: string;
  token: string;
  expiresAt: string;
};

export type SignOUt = undefined;

export async function signIn(data: SignIn, opts?: AxiosRequestConfig<SignIn>) {
  const response = await request<SignInRes>('/api/Auth/login', { method: 'post', data, ...opts });
  return response?.token;
}

export async function signOut() {
  return Promise.resolve(true);
}
