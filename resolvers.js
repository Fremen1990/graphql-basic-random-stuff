const decodeBase64 = (base64String) =>
  Buffer.from(base64String, "base64").toString();
const encodeBase64 = (rawString) => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = (externalId) => decodeBase64(externalId).split("-", 2);
const toDbId = (externalId) => toTypeAndDbId(externalId)[1];

const getResourceByExternalId = (externalId, db) => {
  const [type, dbId] = toTypeAndDbId(externalId);
  return db.getResourceByIdAndType(dbId, type);
};
const id = (resource) => toExternalId(resource.id, resource.type);
const resolvers = {
  Query: {
    books: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
    authors: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery ? search.findAuthors(searchQuery) : db.getAllAuthors(),
    users: (rootValue, { searchQuery }, { db, search }) =>
      searchQuery ? search.findUsers(searchQuery) : db.getAllUsers(),
    book: (rootValue, { id }, { db }) => db.getBookById(toDbId(id)),
    author: (rootValue, { id }, { db }) => db.getAuthorById(toDbId(id)),
    user: (rootValue, { id }, { db }) => db.getUserById(toDbId(id)),
    resource: (rootValue, { id }, { db }) => getResourceByExternalId(id, db),
    resources: (rootValue, args, { db }) => [
      ...db.getAllBookCopies(),
      ...db.getAllAuthors(),
      ...db.getAllUsers(),
      ...db.getAllBooks(),
    ],
  },
  Mutation: {
    borrowBookCopy: (rootValue, { id }, { db, currentUserDbId }) => {
      db.borrowBookCopy(toDbId(id), currentUserDbId);
      return db.getBookCopyById(toDbId(id));
    },
    returnBookCopy: (rootValue, { id }, { db, currentUserDbId }) => {
      db.returnBookCopy(toDbId(id), currentUserDbId);
      return db.getBookCopyById(toDbId(id));
    },
    createUser: (rootValue, { input }, { db }) => {
      try {
        return {
          success: true,
          message: "User successfully created.",
          user: db.createUser(input),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    updateUser: (rootValue, { input: { id, name, info } }, { db }) => {
      try {
        db.updateUser(toDbId(id), { name, info });
        return {
          success: true,
          message: "User successfully updated.",
          user: db.getUserById(toDbId(id)),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    deleteUser: (rootValue, { id }, { db }) => {
      try {
        db.deleteUser(toDbId(id));
        return {
          success: true,
          message: "User successfully deleted.",
          id,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    resetData: (rootValue, args, { db }) => {
      db.revertDBToInitialData();
      return {
        success: true,
        message: "Successfully restored initial data.",
      };
    },
  },
  Book: {
    id,
    author: (book, args, { db }) => db.getAuthorById(book.authorId),
    cover: (book) => ({
      path: book.coverPath,
    }),
    copies: (book, args, { db }) => db.getBookCopiesByBookId(book.id),
  },
  Author: {
    id,
    books: (author, args, { db }) => db.getBooksByAuthorId(author.id),
    photo: (author) => ({
      path: author.photoPath,
    }),
  },
  Avatar: {
    image: (avatar) => ({
      path: avatar.imagePath,
    }),
  },
  Image: {
    url: (image, args, { baseAssetsUrl }) => baseAssetsUrl + image.path,
  },
  User: {
    id,
    ownedBookCopies: (user, args, { db }) => db.getBookCopiesByOwnerId(user.id),
    borrowedBookCopies: (user, args, { db }) =>
      db.getBookCopiesByBorrowerId(user.id),
  },
  BookCopy: {
    id,
    book: (bookCopy, args, { db }) => db.getBookById(bookCopy.bookId),
    owner: (bookCopy, args, { db }) => db.getUserById(bookCopy.ownerId),
    borrower: (bookCopy, args, { db }) =>
      bookCopy.borrowerId && db.getUserById(bookCopy.borrowerId),
  },
  Resource: {
    __resolveType: (resource) => resource.resourceType,
  },
  MutationResult: {
    __resolveType: (mutationResult) => null,
  },
};

module.exports = resolvers;
