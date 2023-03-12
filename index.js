const {ApolloServer, gql} = require("apollo-server")

const PORT = process.env.PORT || 4000

const typeDefs = gql`  type Query {  greeting : String, interestingUrls: [String]}  `

const data = {
    greeting: "Hello World!!!!!!!",
    interestingUrls: ["https://www.google.com", "https://www.youtube.com"]

}

const server = new ApolloServer({
    typeDefs, rootValue: data, playground: true, introspection: true
})
server.listen({port: PORT}).then((result) => {
    console.log(`Server ready at ${result.url}`)
    // console.log("result.server", result.server)
    // console.log("result.port", result.port)
    // console.log("result.family", result.family)
})
