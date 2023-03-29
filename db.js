const data = require("./data");
const toIndex = (id) => parseInt(id, 10) - 1;
const toId = (index) => `${index + 1}`;

const getAuthorIdByBookId = (bookId) =>
  Object.entries(data.bookIdsByAuthorId).find(([authorId, bookIds]) =>
    bookIds.includes(bookId)
  )[0];

const getBookById = (id) => {
  const index = toIndex(id);
  if (index < 0 || index >= data.books.length) {
    return null;
  }
  return {
    ...data.books[index],
    id,
    authorId: getAuthorIdByBookId(id),
  };
};
const getAllBooks = () =>
  data.books.map((book, index) => getBookById(toId(index)));

const getAuthorById = (id) => {
  const index = toIndex(id);
  if (index < 0 || index >= data.authors.length) {
    return null;
  }
  return {
    ...data.authors[toIndex(id)],
    id,
    bookIds: data.bookIdsByAuthorId[id],
  };
};

const getAllAuthors = () =>
  data.authors.map((author, index) => getAuthorById(toId(index)));

const getUserById = (id) => {
  const index = toIndex(id);
  if (index < 0 || index >= data.users.length) {
    return null;
  }
  return {
    ...data.users[toIndex(id)],
    id,
  };
};

const getAllUsers = () =>
  data.users.map((user, index) => getUserById(toId(index)));

const getBookCopyById = (id) => ({
  ...data.bookCopies[toIndex(id)],
  id,
});

const getAllBookCopies = () =>
  data.bookCopies.map((bookCopy, index) => getBookCopyById(toId(index)));

const getBookCopiesByBookId = (bookId) =>
  getAllBookCopies().filter((bookCopy) => bookCopy.bookId === bookId);

const getBookCopiesByUserId = (userId) =>
  getAllBookCopies().filter((bookCopy) => bookCopy.owner.id === userId);

const borrowBookCopy = (bookCopyId, borrowedId) => {
  const index = toIndex(bookCopyId);
  if (index < 0 || index >= data.bookCopies.length) {
    throw new Error("Could not find book copy");
  }
  const bookCopy = data.bookCopies[index];
  if (!!bookCopy.borrowerId) {
    throw new Error("Cannot borrow the bool copy. It is already borrowed");
  }
  bookCopy.borrowerId = borrowedId;
};

const db = {
  getAllBooks,
  getAllAuthors,
  getAllUsers,
  getAllBookCopies,
  getBookCopiesByBookId,
  getBookById,
  getAuthorById,
  getUserById,
  getBookCopiesByUserId,
  getBookCopyById,
  borrowBookCopy,
};
module.exports = db;
