const toDbId = (externalId) => Buffer.from(externalId, "base64").toString();
const toExternalId = (dbId) => Buffer.from(dbId).toString("base64");
const resolvers = {
  Query: {
    books: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
    authors: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery.length > 0
        ? search.findAuthors(searchQuery)
        : db.getAllAuthors(),
    users: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery.length > 0 ? search.findUsers(searchQuery) : db.getAllUsers(),

    book: (rootValue, { id }, { db }) => db.getBookById(toDbId(id)),
    author: (rootValue, { id }, { db }) => db.getAuthorById(id),
    user: (rootValue, { id }, { db }) => db.getUserById(id),
  },
  Book: {
    id: (book) => toExternalId(book.id),
    author: (book, args, { db }) => db.getAuthorById(book.authorId),
    cover: (book) => ({
      path: book.coverPath,
    }),
  },
  Author: {
    id: (author) => toExternalId(author.id),
    books: (author, args, { db }) =>
      author.bookIds.map((bookId) => db.getBookById(bookId)),
    photo: (author) => ({ path: author.photoPath }),
  },
  Image: {
    url: (image, args, context) => context.assetsBaseUrl + image.path,
  },
  User: {
    id: (user) => toExternalId(user.id),
  },
};

module.exports = resolvers;
