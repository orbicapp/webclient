import { apolloClient } from "../apollo/apollo-client";
import { GET_ME_QUERY } from "../graphql";
import { formatResult } from "../utils/service.utils";

// DTOs
export interface User {
  _id: string;
  email: string;
  displayName: string;
  username: string;
  avatarId?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inputs
export interface UpdateUserInput {
  displayName?: string;
  avatarId?: string;
}

// Actions
async function getMe() {
  const { data, errors } = await apolloClient.query<{ me: User }>({
    query: GET_ME_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<User>(data?.me, errors);
}

export const UserService = { getMe };
