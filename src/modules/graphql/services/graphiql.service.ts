import { Component, Inject } from '@nestjs/common';
import * as url from 'url';
import * as GraphiQL from 'apollo-server-module-graphiql';
import { Request } from 'express';

import { GraphQLModuleOptions } from '../interfaces/graphql-module-options.interface';
import { OPTIONS_TOKEN } from '../graphql.constants';

@Component()
export class GraphiQLService {
  constructor(@Inject(OPTIONS_TOKEN) private options: GraphQLModuleOptions) {}

  handle(request: Request) {
    const query = request.url && url.parse(request.url, true).query;
    return GraphiQL.resolveGraphiQLString(query, this.options.graphiql, request);
  }
}
