// https://www.howtographql.com/graphql-js/2-a-simple-query/

const { GraphQLServer } = require("graphql-yoga");

// 1
const typeDefs = `
type Query {
  info: String!
  feed: [Link!]!
}
type Link {
    id: ID!
    description: String!
    url: String!
}
`;

// 2

// Dummy Data
const links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  },
  {
    id: "link-1",
    url: "www.google.com",
    description: "Google Website"
  }
];
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
