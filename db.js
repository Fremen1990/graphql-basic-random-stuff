// id = index +1

const data = require("./data");

const getAuthorByBookId = (bookId) =>
  parseInt(
    Object.entries(data.bookIdsByAuthorIds).find(([authorId, bookIds]) =>
      bookIds.includes(bookId)
    )[0]
  );
console.log("Author of book #10", getAuthorByBookId(10));

const getBookById = (id) => ({
  id,
  ...data.books[id - 1],
  authorId: getAuthorByBookId(id),
});
const getAllBooks = (id) =>
  data.books.map((book, index) => getBookById(index + 1));
const getAuthorById = (id) => ({
  id,
  ...data.authors[id - 1],
  bookIds: data.bookIdsByAuthorIds[id],
});
const getAllAuthors = (id) =>
  data.authors.map((author, index) => getAuthorById(index + 1));
const getUserById = (id) => ({
  id,
  ...data.users[id - 1],
});
const getAllUsers = (id) =>
  data.users.map((user, index) => getUserById(index + 1));

const db = {
  getAllBooks,
  getAllAuthors,
  getAllUsers,
  getBookById,
  getAuthorById,
  getUserById,
};

module.exports = db;
