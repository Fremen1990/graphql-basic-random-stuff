const lunr = require("lunr");

function initIndex(resourceType, searchFields, db) {
    return lunr(function() {
        this.ref("id");
        searchFields.forEach(([name, options]) => {
            this.field(name, options);
        });
        db.findAllResourcesByType(resourceType).forEach(resource => {
            this.add(resource);
        });
    });
}

class Search {
    constructor(db, searchFieldsByType) {
        this.db = db;
        this.searchFieldsByType = searchFieldsByType;
        this.db.registerListener(this);

        this.indices = {};
        Object.keys(this.searchFieldsByType).forEach(resourceType =>
            this.rebuildIndex(resourceType)
        );
    }
    onDbChange(change, resourceType, id) {
        if (!this.searchFieldsByType[resourceType]) {
            return;
        }
        this.rebuildIndex(resourceType);
    }
    rebuildIndex(resourceType) {
        const searchFields = this.searchFieldsByType[resourceType];
        if (!searchFields) {
            throw new Error(
                `Search fields are not defined for this resource type '${resourceType}'`
            );
        }
        this.indices[resourceType] = initIndex(resourceType, searchFields, this.db);
    }
    findResources(searchQuery, resourceType) {
        if (!this.indices[resourceType]) {
            throw new Error(
                `Index for this resource does not exist '${resourceType}'`
            );
        }
        const results = [];
        this.indices[resourceType]
            .search(searchQuery)
            .forEach(result =>
                results.push(this.db.findResourceByIdAndType(result.ref, resourceType))
            );
        return results;
    }
}

module.exports = {
    Search
};
