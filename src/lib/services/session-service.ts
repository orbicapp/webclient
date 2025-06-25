import { apolloClient } from "../apollo/apollo-client";
import { LOGOUT_MUTATION } from "../graphql";
import { formatResult } from "../utils/service.utils";

async function logout() {
  const { data, errors } = await apolloClient.mutate<{ logout: boolean }>({
    mutation: LOGOUT_MUTATION,
  });

  return formatResult<boolean>(data?.logout, errors);
}

async function logoutAllSessions() {
  const { data, errors } = await apolloClient.mutate<{
    logoutAllSessions: boolean;
  }>({
    mutation: LOGOUT_MUTATION,
  });

  return formatResult<boolean>(data?.logoutAllSessions, errors);
}

export const SessionService = { logout, logoutAllSessions };
