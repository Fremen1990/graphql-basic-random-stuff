const { gql } = require("apollo-server");
const typeDefs = gql`
  type Query {
    authors(searchQuery: String! = ""): [Author!]!
    author(id: ID!): Author
    books(
      searchQuery: String! = ""
      pageNumber: Int = 1
      pageSize: Int = 5
    ): PaginatedBooks!
    book(id: ID!): Book
    users(searchQuery: String! = ""): [User!]!
    user(id: ID!): User
    currentUser: User
    resource(id: ID!): Resource
    resources: [Resource!]!
  }
  type Mutation {
    borrowBookCopy(id: ID!): BookCopy
    returnBookCopy(id: ID!): BookCopy
    createUser(input: CreateUserInput!): UserMutationResult!
    updateUser(input: UpdateUserInput!): UserMutationResult!
    deleteUser(id: ID!): DeleteUserMutationResult!
    signUp(input: SignUpInput!): AuthResult!
    logIn(input: LogInInput!): AuthResult!
    resetData: ResetMutationResult!
  }
  input SignUpInput {
    name: String!
    email: String!
    info: String! = "I'll tell you more about me later..."
    password: String!
  }
  input LogInInput {
    email: String!
    password: String!
  }
  type PaginatedBooks {
    results: [Book!]!
    pageInfo: PageInfo!
  }
  type PageInfo {
    currentPageNumber: Int!
    previousPageNumber: Int
    nextPageNumber: Int
    firstPageNumber: Int!
    lastPageNumber: Int!
  }
  type AuthResult implements MutationResult {
    success: Boolean!
    message: String!
    currentUser: User
    token: String
  }
  input CreateUserInput {
    name: String! = "John"
    email: String!
    info: String!
    password: String!
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
  type UserMutationResult implements MutationResult {
    success: Boolean!
    message: String!
    user: User
  }
  type DeleteUserMutationResult implements MutationResult {
    success: Boolean!
    message: String!
    id: ID
  }
  type ResetMutationResult implements MutationResult {
    success: Boolean!
    message: String!
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
  type CurrentUser implements Resource {
    id: ID!
    name: String!
    email: String!
    isAdmin: Boolean!
    info: String!
    avatar: Avatar!
  }
  type User implements Resource {
    id: ID!
    name: String!
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
