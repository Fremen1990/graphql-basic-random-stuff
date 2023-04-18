const searchFieldsByType = {
    Book: [["title", { boost: 10 }], ["description", {}]],
    Author: [["name", { boost: 10 }], ["bio", {}]],
    User: [["name", { boost: 10 }], ["info", {}]]
};

module.exports = searchFieldsByType;
