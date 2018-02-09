import { GraphiQLData } from 'apollo-server-module-graphiql';

export interface GraphQLModuleOptions {
  types: string;
  graphiql?: GraphiQLData;
}
