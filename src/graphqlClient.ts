import { GraphQLClient } from "graphql-request";
import { endpoint } from "./constants";

export const graphQLClient = new GraphQLClient(endpoint, {});
