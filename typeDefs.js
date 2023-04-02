const { gql } = require("apollo-server");
const typeDefs = gql`
  type Query {
    authors(searchQuery: String! = ""): [Author!]!
    author(id: ID!): Author
    books(searchQuery: String! = ""): [Book!]!
    book(id: ID!): Book
    users(searchQuery: String! = ""): [User!]!
    user(id: ID!): User
    resource(id: ID!): Resource
    resources: [Resource!]!
  }
  type Mutation {
    borrowBookCopy(id: ID!): BookCopy
    returnBookCopy(id: ID!): BookCopy
    createUser(input: CreateUserInput!): UserMutationResult!
    updateUser(input: UpdateUserInput!): UserMutationResult!
    deleteUser(id: ID!): DeleteUserResult!
    resetData: ResetResult!
  }
  input CreateUserInput {
    name: String!
    info: String!
    email: String!
  }
  input UpdateUserInput {
    id: ID!
    name: String!
    info: String!
  }
  interface MutationResult {
    success: Boolean!
    message: String!
  }
  type ResetResult {
    success: Boolean!
    message: String!
  }
  type DeleteUserResult {
    success: Boolean!
    message: String!
    id: ID
  }
  type UserMutationResult {
    success: Boolean!
    message: String!
    user: User!
  }
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
    ownedBookCopies: [BookCopy!]!
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
    book: Book!
    owner: User!
    borrower: User
  }
`;

module.exports = typeDefs;
