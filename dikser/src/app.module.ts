import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'
import { join } from 'path'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { AuthModule } from './auth/auth.module'
import { PostsModule } from './posts/posts.module'
import { PassportModule } from '@nestjs/passport'
import { RelationshipModule } from './relationship/relationship.module'
import { BadgesModule } from './badges/badges.module'
import { MailingModule } from './mailing/mailing.module'
import { CommentsModule } from './comments/comments.module'
import { QueuesModule } from './queues/queues.module'

@Module({
	imports: [
		DatabaseModule,
		UsersModule,
		PassportModule.register({ session: true }),
		GraphQLModule.forRoot({
			// GraphQl subscriptions over WebSocket
			installSubscriptionHandlers: true,
			subscriptions: {
				path: '/subscriptions',
			},
			playground: process.env.NODE_ENV !== 'production',
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			cors: {
				origin: [process.env.CLIENT_ORIGIN!, process.env.A_ORIGIN!],
				credentials: true,
				allowedHeaders: ['Content-Type', 'key'],
			},
			/**
			 * Intercept graphql error, bind a custom json object
			 * @Example BadRequestException | UnauthorizedException | InvalidRequestException | etc
			 * @returns custom message object for better error handling
			 */
			formatError: (error: GraphQLError) => {
				const graphQLFormattedError: GraphQLFormattedError = {
					message:
						error.extensions?.exception?.response?.message ||
						error.message,
					extensions: {
						error: error.extensions?.exception?.response?.error,
						status: error.extensions?.exception?.status,
					},
				}
				return graphQLFormattedError
			},
		}),
		AuthModule,
		PostsModule,
		RelationshipModule,
		BadgesModule,
		MailingModule,
		CommentsModule,
		QueuesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
