// https://www.howtographql.com/graphql-js/2-a-simple-query/
const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
    link: (parent, { id }) => {
      return links.filter(item => item.id === id)[0];
    }
  },
  //   Dont need this because the server will infer this basic structure
  //   Link: {
  //     id: parent => parent.id,
  //     description: parent => parent.description,
  //     url: parent => parent.url
  //   },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
    },
    updateLink: (parent, args) => {
      links.map(item => {
        if (item.id === args.id) {
          item.description = args.description || item.description;
          item.url = args.url || item.url;
        }
      })[0];
      const updatedLink = links.filter(item => item.id === args.id)[0];
      return updatedLink;
    },
    deleteLink: (parent, args) => {
      function itemToDelete(element) {
        return element.id === args.id;
      }
      let deletedLink = links.filter(item => item.id === args.id)[0];
      let index = links.findIndex(itemToDelete);
      links.splice(index);
      return deletedLink;
    }
  }
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
