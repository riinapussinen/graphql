import mongoose from 'mongoose';
import { GraphQLServer } from 'graphql-yoga';
import graphqlConfig from './api';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { authMiddleware } from './api/middlewares';
import { getDateInNumbers, parseDate } from './utils/util';
import { DB } from './config';

const PORT = 3000;
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${DB}`);
mongoose.set('debug', true);

const options = {
  tracing: true,
  debug: true,
  port: PORT,
  endpoint: '/graphql',
  playground: '/docs'
};

//create a schema
const schema = makeExecutableSchema({
  typeDefs: graphqlConfig.typeDefs,
  resolvers: graphqlConfig.resolvers
});
//apply middlewares on the schema
const protectedSchema = applyMiddleware(schema, authMiddleware);
//provided the protected Schema to graphql Server
const server = new GraphQLServer({
  schema: protectedSchema,
  context: graphqlConfig.context
});
// const dateInNumbers = getDateInNumbers();
// console.log(dateInNumbers);
// const date = parseDate(dateInNumbers);
// console.log(date);
server.start(options, () => console.log('Server is running on localhost:3000'));
