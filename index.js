const {ApolloServer, ServerInfo} = require("apollo-server")

const typeDefs = `
type Query {
greeting : String}
`

const server = new ApolloServer({
    typeDefs
})
server.listen({port: 4000}).then((result) => {
    console.log(`Server ready at ${result.url}`)
    // console.log("result.server", result.server)
    // console.log("result.port", result.port)
    // console.log("result.family", result.family)
})
