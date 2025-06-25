import { GraphQLFormattedError } from "graphql";

export function formatResult<T>(
  data: T | undefined,
  errors: readonly GraphQLFormattedError[] | undefined
): [T, undefined] | [undefined, string] {
  if (errors) {
    return [undefined, errors[0].message];
  }

  if (!data) {
    return [undefined, "Unknown error (no data returned)"];
  }

  return [data, undefined];
}
