import { useMutation } from '@tanstack/react-query';
import { get, post } from '@/lib/api';
import { signIn, signUp, signOut, sendVerificationEmail as sendVerificationEmailClient } from '@/lib/auth-client';
import { ENDPOINTS } from '@/lib/config';

// Types
interface SignInEmailParams {
  email: string;
  password: string;
}

interface SignUpEmailParams {
  email: string;
  password: string;
  name: string;
  callbackURL?: string;
}

interface SendVerificationEmailParams {
  email: string;
  callbackURL?: string;
}

interface ForgotPasswordParams {
  email: string;
  redirectTo: string;
}

interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface VerifyEmailResponse {
  success?: boolean;
  error?: {
    message: string;
  };
}

// Sign in with email
export function useSignInEmail() {
  return useMutation({
    mutationFn: async (params: SignInEmailParams) => {
      return await signIn.email(params);
    },
  });
}

// Sign up with email
export function useSignUpEmail() {
  return useMutation({
    mutationFn: async (params: SignUpEmailParams) => {
      return await signUp.email(params);
    },
  });
}

// Sign in with social provider (Google)
export function useSignInSocial() {
  return useMutation({
    mutationFn: async (params: { provider: 'google'; callbackURL: string }) => {
      return await signIn.social(params);
    },
  });
}

// Sign out
export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      return await signOut();
    }
  });
}

// Send verification email
export function useSendVerificationEmail() {
  return useMutation({
    mutationFn: async (params: SendVerificationEmailParams) => {
      return await sendVerificationEmailClient(params);
    },
  });
}

// Verify email (mutation since it's a GET that changes state)
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string): Promise<VerifyEmailResponse> => {
      return await get<VerifyEmailResponse>(`${ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`);
    },
  });
}

// Forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (params: ForgotPasswordParams) => {
      return await post(`${ENDPOINTS.AUTH.FORGOT_PASSWORD}`, params);
    },
  });
}

// Reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: async (params: ResetPasswordParams) => {
      return await post(`${ENDPOINTS.AUTH.RESET_PASSWORD}`, params);
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (params: ChangePasswordParams) => {
      return await post(`${ENDPOINTS.AUTH.CHANGE_PASSWORD}`, params);
    },
  });
}

