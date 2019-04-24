import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
  } from 'graphql';
   
  import {AnalyticsService} from '../AnalyticsService';
  // var schema = new GraphQLSchema({
   const query = new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        name: {
          type: GraphQLString,
          resolve(root, args) {
              // call the REST service to resolve Product data.
            AnalyticsService.product(args.id);
            return 'Calvin Klein blah blah';
          }
        }
      }
    })
  // });
  export default query;