const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const createDb = require("./data/db");
const { Search } = require("./data/search");
const auth = require("./data/auth");

const initialData = require("./config/initialData");
const searchFieldsByType = require("./config/searchFieldsByType");
const createDataAccess = require("./dataAccess");

const db = createDb(initialData);
const search = new Search(db, searchFieldsByType);

const dataAccess = createDataAccess(db, search, auth);

const PORT = process.env.PORT || 4000;
const BASE_ASSETS_URL =
    process.env.BASE_ASSETS_URL || "http://examples.devmastery.pl/assets";

const context = ({ req }) => {
  const currentUserDbId = auth.authenticateRequest(req, db);
  return {
    dataAccess,
    currentUserDbId,
    baseAssetsUrl: BASE_ASSETS_URL
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
