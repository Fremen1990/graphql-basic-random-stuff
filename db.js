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

const db = {
  getAllBooks,
  getAllAuthors,
  getAllUsers,
  getBookById,
  getAuthorById,
  getUserById,
};
module.exports = db;
