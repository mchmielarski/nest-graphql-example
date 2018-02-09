import { Module, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { GraphQLController } from './controllers';
import { UsersResolver } from './resolvers';
import { UsersService } from './services';

@Module({
  imports: [
    GraphQLModule.forRoot({
      types: 'src/app/types/*.gql',
      graphiql: {
        endpointURL: '/graphql'
      }
    })
  ],
  components: [UsersResolver, UsersService],
  controllers: [GraphQLController]
})
export class AppModule {
  configure(consumer: MiddlewaresConsumer) {
    consumer.apply((req, res, next) => {
      req.user = req.query.auth ? { id: 4 } : null;
      next();
    })
    .forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
