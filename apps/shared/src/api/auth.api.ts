import { request } from './client';
import { AUTH_ENDPOINTS } from '../constants/endpoints';
import type { SignInRequest, SignInResponse, AuthUser, AuthSession } from '../types/auth.types';

export async function signIn(credentials: SignInRequest) {
  return request<SignInResponse>('POST', AUTH_ENDPOINTS.SIGN_IN, credentials);
}

export async function signOut() {
  return request<void>('POST', AUTH_ENDPOINTS.SIGN_OUT);
}

export async function getSession() {
  return request<{ user: AuthUser; session: AuthSession }>('GET', AUTH_ENDPOINTS.GET_SESSION);
}
