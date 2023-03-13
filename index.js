const {ApolloServer, gql} = require("apollo-server")

const PORT = process.env.PORT || 4000

const typeDefs = gql`  type Query {  greeting : String, interestingUrls: [String], randomDiceThrow: [Int]}  `

function rootValue() {
    const getRandomDiceThrow = (sides) => {
        return Math.floor(Math.random() * sides) + 1
    }
    return {
        greeting: "Hello World!!!!!!!",
        interestingUrls: ["https://www.google.com", "https://www.youtube.com"],
        randomDiceThrow: [getRandomDiceThrow(6), getRandomDiceThrow(6), getRandomDiceThrow(6)]
    }
}
// TODO Lekcja 18. Float i Boolean

const server = new ApolloServer({
    typeDefs, rootValue: rootValue, playground: true, introspection: true
})
server.listen({port: PORT}).then((result) => {
    console.log(`Server ready at ${result.url}`)
    // console.log("result.server", result.server)
    // console.log("result.port", result.port)
    // console.log("result.family", result.family)
})
