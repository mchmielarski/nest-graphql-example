import { Module, DynamicModule, Inject } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import { OPTIONS_TOKEN } from './graphql.constants';
import { GraphQLModuleOptions } from './interfaces/graphql-module-options.interface';
import { GraphQLFactory } from './graphql.factory';
import { GraphQLService } from './services/graphql.service';
import { GraphiQLService } from './services/graphiql.service';
import { ResolversExplorerService } from './services/resolvers-explorer.service';

@Module({
	components: [
		GraphQLFactory,
		GraphiQLService,
		GraphQLService,
		MetadataScanner,
		ResolversExplorerService,
	],
	exports: [GraphQLService, GraphiQLService, GraphQLFactory, ResolversExplorerService],
})
export class GraphQLModule {
	static forRoot(options: GraphQLModuleOptions): DynamicModule {
		return {
			module: GraphQLModule,
			components: [{
				provide: OPTIONS_TOKEN,
				useValue: options
			}]
		};
	}

	constructor(
		private readonly graphqlService: GraphQLService
	) {}

	onModuleInit() {
		this.graphqlService.init();
	}
}
