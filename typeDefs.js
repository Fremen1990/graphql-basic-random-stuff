const { gql } = require("apollo-server");
const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
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
    anything(id: ID!): Anything
    everything: [Anything!]!
    resources: [Resource!]!
    resource(id: ID!): Resource
  }

  type Mutation {
    borrowBookCopy(id: ID!): BookCopy!
    returnBookCopy(id: ID!): BookCopy!
  }

  union Anything = Book | Author | User | BookCopy

  interface Resource {
    id: ID!
  }

  type Author implements Resource {
    id: ID!
    name: String!
    photo: Image!
    bio: String!
    books: [Book!]!
  }
  type Book implements Resource {
    id: ID!
    title: String!
    cover: Image!
    author: Author!
    description: String!
    copies: [BookCopy!]!
  }
  type User implements Resource {
    id: ID!
    name: String!
    email: String!
    info: String!
    avatar: Avatar!
    ownedBookCopies: [BookCopy]!
    borrowedBookCopies: [BookCopy!]!
  }
  type Image {
    url: String!
  }
  type Avatar {
    image: Image!
    color: String!
  }
  type BookCopy implements Resource {
    id: ID!
    owner: User!
    book: Book!
    borrower: User
  }
`;

module.exports = typeDefs;
