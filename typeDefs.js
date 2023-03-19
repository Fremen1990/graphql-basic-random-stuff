const { gql } = require("apollo-server");
const typeDefs = gql`
  schema {
    query: Query
  }

  """
  ### The object representing a books

  It contains the following fields:
  - text: String
  - author: String
  """
  type Query {
    authors: [Author!]!
    author(id: ID!): Author
    books(searchQuery: String! = ""): [Book!]!
    book(id: ID!): Book
    users: [User!]!
    user(id: ID!): User
  }

  type Book {
    id: ID!
    title: String!
    cover: Image!
    description: String!
    author: Author
  }

  type Author {
    id: ID!
    name: String!
    photo: Image!
    bio: String!
    books: [Book]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    info: String!
    avatar: Avatar!
  }

  type Image {
    url: String!
  }

  type Avatar {
    image: Image!
    color: String
  }
`;

module.exports = typeDefs;
