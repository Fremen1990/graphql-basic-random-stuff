const lunr = require("lunr");

function initBookIndex(db) {
  return lunr(function () {
    this.ref("id");
    this.field("title");
    this.field("description");

    db.getAllBooks().forEach(function (book) {
      this.add(book);
    }, this);
  });
}

function initAuthorIndex(db) {
  return lunr(function () {
    this.ref("id");
    this.field("name");
    this.field("bio");

    db.getAllAuthors().forEach(function (author) {
      this.add(author);
    }, this);
  });
}

function initUserIndex(db) {
  return lunr(function () {
    this.ref("id");
    this.field("name");
    this.field("info");

    db.getAllUsers().forEach(function (user) {
      this.add(user);
    }, this);
  });
}

class Search {
  constructor(db) {
    this.db = db;
    this.bookIndex = initBookIndex(this.db);
    this.authorIndex = initAuthorIndex(this.db);
    this.userIndex = initUserIndex(this.db);
  }

  findBooks(searchQuery) {
    const results = this.bookIndex.search(searchQuery);
    const foundIds = results.map((result) => result.ref);
    return foundIds.map(this.db.getBookById);
  }

  findAuthors(searchQuery) {
    const results = this.authorIndex.search(searchQuery);
    const foundIds = results.map((result) => result.ref);
    return foundIds.map(this.db.getAuthorById);
  }

  findUsers(searchQuery) {
    const results = this.userIndex.search(searchQuery);
    const foundIds = results.map((result) => result.ref);
    return foundIds.map(this.db.getUserById);
  }
}

module.exports = { Search };
