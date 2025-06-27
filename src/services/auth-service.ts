import { apolloClient } from "../lib/apollo/apollo-client";
import {
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  VERIFY_EMAIL_MUTATION,
} from "../lib/graphql";
import { formatResult } from "../lib/utils/service.utils";
import { User } from "./user-service";

// DTOs (Outputs)
export interface AuthPayload {
  user: User;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
}

// Inputs
export interface RegisterUserInput {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

// Actions
async function login(input: LoginInput) {
  const { data, errors } = await apolloClient.mutate<{ login: AuthPayload }>({
    mutation: LOGIN_MUTATION,
    variables: { input },
    fetchPolicy: "network-only",
  });

  return formatResult<AuthPayload>(data?.login, errors);
}

async function register(input: RegisterUserInput) {
  const { data, errors } = await apolloClient.mutate<{ register: AuthPayload }>(
    {
      mutation: REGISTER_MUTATION,
      variables: { input },
      fetchPolicy: "network-only",
    }
  );

  return formatResult<AuthPayload>(data?.register, errors);
}

async function refreshToken(refreshToken: string) {
  const { data, errors } = await apolloClient.mutate<{
    refreshToken: AuthPayload;
  }>({
    mutation: REFRESH_TOKEN_MUTATION,
    variables: { refreshToken },
    fetchPolicy: "network-only",
  });

  return formatResult<AuthPayload>(data?.refreshToken, errors);
}

async function verifyEmail(code: string) {
  const { data, errors } = await apolloClient.mutate<{ verifyEmail: boolean }>({
    mutation: VERIFY_EMAIL_MUTATION,
    variables: { code },
    fetchPolicy: "network-only",
  });

  return formatResult<boolean>(data?.verifyEmail, errors);
}

async function requestPasswordReset(email: string) {
  const { data, errors } = await apolloClient.mutate<{
    requestPasswordReset: boolean;
  }>({
    mutation: REQUEST_PASSWORD_RESET_MUTATION,
    variables: { email },
    fetchPolicy: "network-only",
  });

  return formatResult<boolean>(data?.requestPasswordReset, errors);
}

export const AuthService = {
  login,
  register,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
};
