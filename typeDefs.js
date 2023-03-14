const {gql} = require("apollo-server");
 const typeDefs = gql`

    schema {
        query: MyQuery
    }

    type MyQuery {
        "A simple greeting"
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

    enum DayOfWeek {
        MON
        TUE
        WED
        THU
        FRI
        SAT
        SUN
    }
    """
    ### The object representing a quote

    It contains the following fields:
    - text: String
    - author: String
    """
    type Quote {
        text: String
        author: String
    }

    ,`

module.exports = typeDefs;