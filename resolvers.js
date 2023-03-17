const resolvers = {
  Book: {
    author: (book, args, { db }) => db.getAuthorById(book.authorId),
    cover: (book) => ({
      path: book.coverPath,
    }),
  },
  Author: {
    books: (author, args, { db }) =>
      author.bookIds.map((bookId) => db.getBookById(bookId)),
    photo: (author) => ({ path: author.photoPath }),
  },
  Image: {
    url: (image, args, context) => context.assetsBaseUrl + image.path,
  },
  Query: {
    books: (rootValue, args, { db }) => db.getAllBooks(),
    authors: (rootValue, args, { db }) => db.getAllAuthors(),
    users: (rootValue, args, { db }) => db.getAllUsers(),
  },
};

module.exports = resolvers;
