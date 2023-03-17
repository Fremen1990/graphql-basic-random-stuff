const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const db = require("./db");

const PORT = process.env.PORT || 4000;
const ASSETS_BASE_URL =
  process.env.ASSETS_BASE_URL || "http://examples.devmastery.pl/assets";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    db,
    assetsBaseUrl: ASSETS_BASE_URL,
  },
  playground: true,
  introspection: true,
});

server.listen({ port: PORT }).then((result) => {
  console.log(`Server ready at ${result.url}`);
  // console.log("result.server", result.server)
  // console.log("result.port", result.port)
  // console.log("result.family", result.family)
});
