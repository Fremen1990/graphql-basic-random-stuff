const {ApolloServer, gql} = require("apollo-server")
const Quotes =  require("inspirational-quotes")
const PORT = process.env.PORT || 4000

const typeDefs = gql`  
    
    schema {
        query: MyQuery
    }
    
    type MyQuery {
        greeting : String!,
        schrodingerCatGreeting: String,
        interestingUrls: [String!]!,
        randomDiceThrow: [Int],
        pi:Float!,
        isItFriday: Boolean!,
        randomCoinTossesUntilTrue: [Boolean!]!
        today: DayOfWeek!
        workDays: [DayOfWeek!]!,
        randomQuote: Quote!
}

type Quote {
    text: String
    author: String
}

enum DayOfWeek {
    MON
    TUE
    WED
    THU
    FRI
    SAT
    SUN
}

,`

function rootValue() {
    const getRandomDiceThrow = (sides) => {
        return Math.floor(Math.random() * sides) + 1
    }
    const today = new Date().getDay()
    const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const randomCoinToss = () => Math.random() < 0.5
    const getRandomCoinTossesUntilTrue = () => {
        const tosses = []
        let toss = randomCoinToss()
        while (!toss) {
            tosses.push(toss)
            toss = randomCoinToss()
        }
        tosses.push(toss)
        return tosses
    }
    return {
        greeting: "Hello world!",
        schrodingerCatGreeting: randomCoinToss()? "Meow" : null,
        interestingUrls: ["https://www.google.com", "https://www.youtube.com"],
        randomDiceThrow: [getRandomDiceThrow(6), getRandomDiceThrow(6), getRandomDiceThrow(6)],
        pi: Math.PI,
        isItFriday: today === 5,
        randomCoinTossesUntilTrue: getRandomCoinTossesUntilTrue(),
        today: DAYS_OF_WEEK[today],
        workDays: DAYS_OF_WEEK.slice(1, 6),
        randomQuote: Quotes.getQuote()
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
