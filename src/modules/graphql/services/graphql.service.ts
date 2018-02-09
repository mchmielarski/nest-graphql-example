import { Component, Inject } from '@nestjs/common';
import { runHttpQuery } from 'apollo-server-core';
import { Request } from 'express';

import { GraphQLModuleOptions } from '../interfaces/graphql-module-options.interface';
import { OPTIONS_TOKEN } from '../graphql.constants';
import { GraphQLFactory } from '../graphql.factory';

@Component()
export class GraphQLService {
  private schema: any;

	constructor(
		@Inject(OPTIONS_TOKEN) private readonly options: GraphQLModuleOptions,
		private readonly factory: GraphQLFactory
	) {}

  handle(request: Request, options: any = {}) {
    return runHttpQuery([request], {
      method: request.method,
      options: {
        rootValue: request,
        schema: this.schema,
        debug: false,
        ...options
      },
      query: this.getQuery(request)
    });
  }

  init() {
		const typeDefs = this.factory.mergeTypesByPaths(this.options.types);
		this.schema = this.factory.createSchema({ typeDefs });
  }

  private getQuery(request: Request) {
    return request.method === 'POST' ? request.body : request.query;
  }
}
