import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Event {
    id: String!
    type: String!
    listeners: [Listener]
  }

  type Listener {
    eventId: String!
    trigger: String
  }

  type Product {
      name: ProductName!
  }

  type ProductName {
      name: String!
  }


  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    events: [Event]
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    addEvent (
        name: String!
        type: String!
    ): Event

    upvotePost (
      postId: Int!
    ): Post
  }

`;


// example data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
];

const events = [
    { type: 'view', id: 'EVENT.View.viewed'},
    { type: 'link', id: 'EVENT.ProductThumbnail.clicked'}
]

const resolvers = {
  Query: {
    events: () => events,
    posts: () => posts,
    author: (_, { id }) => find(authors, { id }),
  },

  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
    addEvent: (_, {name, type}) => {
        const event = {name, type};
        return event;

    }
  },

  Author: {
    posts: author => filter(posts, { authorId: author.id }),
  },
  Event: {
    listeners: event => find (listeners, {eventId: event.id})
  },
  Post: {
    author: post => find(authors, { id: post.authorId }),
  },
};

export default makeExecutableSchema({
    typeDefs,
    resolvers,
});
