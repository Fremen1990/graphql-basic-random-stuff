const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const rootValue = require("./rootValue");

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  rootValue: rootValue,
  playground: true,
  introspection: true,
});

server.listen({ port: PORT }).then((result) => {
  console.log(`Server ready at ${result.url}`);
  // console.log("result.server", result.server)
  // console.log("result.port", result.port)
  // console.log("result.family", result.family)
});
