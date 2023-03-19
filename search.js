class Search {
  constructor(db) {
    this.db = db;
  }

  findBooks(searchQuery) {
    const foundIds = ["1", "12", "20"];
    return foundIds.map(this.db.getBookById);
  }
}

module.exports = { Search };
