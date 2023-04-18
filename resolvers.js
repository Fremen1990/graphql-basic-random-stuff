const decodeBase64 = (base64String) =>
    Buffer.from(base64String, "base64").toString();
const encodeBase64 = (rawString) => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = (externalId) => decodeBase64(externalId).split("-", 2);
const toDbId = (externalId) => toTypeAndDbId(externalId)[1];

const getResourceByExternalId = (externalId, dataAccess) => {
  const [type, dbId] = toTypeAndDbId(externalId);
  return dataAccess.getResourceByIdAndType(dbId, type);
};
const id = (resource) => toExternalId(resource.id, resource.type);
function requireAuthorizedUser(currentUserDbId) {
  if (!currentUserDbId) {
    throw new Error("Unauthorized access. Please Log in.");
  }
}
function requireAuthorizedAdmin(currentUserDbId, dataAccess) {
  requireAuthorizedUser(currentUserDbId);
  const currentUser = dataAccess.getUserById(currentUserDbId);
  if (!currentUser.isAdmin) {
    throw new Error("Unauthorized access. Please Log in as admin.");
  }
}
const resolvers = {
  Query: {
    books: (rootValue, { searchQuery, pageNumber, pageSize }, { dataAccess }) =>
        dataAccess.searchAndPaginateBooks(searchQuery, pageNumber, pageSize),
    authors: (rootValue, { searchQuery }, { dataAccess }) =>
        dataAccess.searchAuthors(searchQuery),
    users: (rootValue, { searchQuery }, { dataAccess }) =>
        dataAccess.searchUsers(searchQuery),
    book: (rootValue, { id }, { dataAccess }) =>
        dataAccess.getBookById(toDbId(id)),
    author: (rootValue, { id }, { dataAccess }) =>
        dataAccess.getAuthorById(toDbId(id)),
    user: (rootValue, { id }, { dataAccess }) =>
        dataAccess.getUserById(toDbId(id)),
    currentUser: (rootValue, args, { dataAccess, currentUserDbId }) =>
        dataAccess.getUserById(currentUserDbId),
    resource: (rootValue, { id }, { dataAccess }) =>
        getResourceByExternalId(id, dataAccess),
    resources: (rootValue, args, { dataAccess }) => [
      ...dataAccess.getAllBookCopies(),
      ...dataAccess.getAllAuthors(),
      ...dataAccess.getAllUsers(),
      ...dataAccess.getAllBooks()
    ]
  },
  Mutation: {
    borrowBookCopy: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedUser(currentUserDbId);
      dataAccess.borrowBookCopy(toDbId(id), currentUserDbId);
      return dataAccess.getBookCopyById(toDbId(id));
    },
    returnBookCopy: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedUser(currentUserDbId);
      dataAccess.returnBookCopy(toDbId(id), currentUserDbId);
      return dataAccess.getBookCopyById(toDbId(id));
    },
    logIn: (rootValue, { input: { email, password } }, { dataAccess }) => {
      try {
        const { currentUser, token } = dataAccess.login(email, password);
        return {
          success: true,
          message: "You've successfully logged in.",
          currentUser,
          token
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    signUp: (rootValue, { input }, { dataAccess }) => {
      try {
        dataAccess.createUser(input);
        const { currentUser, token } = dataAccess.login(
            input.email,
            input.password
        );
        return {
          success: true,
          message: "You've successfully signed Up.",
          currentUser,
          token
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    createUser: (rootValue, { input }, { currentUserDbId, dataAccess }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        return {
          success: true,
          message: "User successfully created.",
          user: dataAccess.createUser(input)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    updateUser: (
        rootValue,
        { input: { id, name, info } },
        { currentUserDbId, dataAccess }
    ) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.updateUser(toDbId(id), { name, info });
        return {
          success: true,
          message: "User successfully updated.",
          user: dataAccess.getUserById(toDbId(id))
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    deleteUser: (rootValue, { id }, { currentUserDbId, dataAccess }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.deleteUser(toDbId(id));
        return {
          success: true,
          message: "User successfully deleted.",
          id
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    resetData: (rootValue, args, { currentUserDbId, dataAccess }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      dataAccess.revertToInitialData();
      return {
        success: true,
        message: "Successfully restored initial data."
      };
    }
  },
  Book: {
    id,
    author: (book, args, { dataAccess }) =>
        dataAccess.getAuthorById(book.authorId),
    cover: (book) => ({
      path: book.coverPath
    }),
    copies: (book, args, { dataAccess }) =>
        dataAccess.getBookCopiesByBookId(book.id)
  },
  Author: {
    id,
    books: (author, args, { dataAccess }) =>
        dataAccess.getBooksByAuthorId(author.id),
    photo: (author) => ({
      path: author.photoPath
    })
  },
  Avatar: {
    image: (avatar) => ({
      path: avatar.imagePath
    })
  },
  Image: {
    url: (image, args, { baseAssetsUrl }) => baseAssetsUrl + image.path
  },
  User: {
    id,
    ownedBookCopies: (user, args, { dataAccess }) =>
        dataAccess.getBookCopiesByOwnerId(user.id),
    borrowedBookCopies: (user, args, { dataAccess }) =>
        dataAccess.getBookCopiesByBorrowerId(user.id)
  },
  CurrentUser: {
    id,
    isAdmin: (currentUser) => !!currentUser.isAdmin
  },
  BookCopy: {
    id,
    book: (bookCopy, args, { dataAccess }) =>
        dataAccess.getBookById(bookCopy.bookId),
    owner: (bookCopy, args, { dataAccess }) =>
        dataAccess.getUserById(bookCopy.ownerId),
    borrower: (bookCopy, args, { dataAccess }) =>
        bookCopy.borrowerId && dataAccess.getUserById(bookCopy.borrowerId)
  },
  Resource: {
    __resolveType: (resource) => resource.resourceType
  },
  MutationResult: {
    __resolveType: () => null
  }
};

module.exports = resolvers;
