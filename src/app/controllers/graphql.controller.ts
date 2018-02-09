import { Controller, Get, Post, Req } from '@nestjs/common';

import { GraphQLService, GraphiQLService } from '@nestjs/graphql';

@Controller()
export class GraphQLController {

  constructor(
    private readonly graphQLService: GraphQLService,
    private readonly graphiQLService: GraphiQLService
  ) {}

  @Get('graphql')
  graphQLGet(@Req() request) {
    return this.handle(request);
  }

  @Post('graphql')
  graphQLPost(@Req() request) {
    return this.handle(request);
  }

  @Get('graphiql')
  graphiQL(@Req() request) {
    return this.graphiQLService.handle(request);
  }

  private handle(request) {
    return this.graphQLService.handle(request, {
      context: {
        user: request.user
      }
    });
  }
}
