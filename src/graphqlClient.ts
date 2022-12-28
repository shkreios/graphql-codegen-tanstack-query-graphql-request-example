import { GraphQLClient } from "graphql-request";
import { endpoint } from "./constants";
import { getSdk } from "./gql/client-types";

const graphQLClient = new GraphQLClient(endpoint, {});
export const sdk = getSdk(graphQLClient);
