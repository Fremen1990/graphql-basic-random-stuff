function paginate(array, pageNumber, pageSize) {
    validateParams(pageNumber, pageSize);
    return {
        results: getPage(array, pageNumber, pageSize),
        pageInfo: getPageInfo(array, pageNumber, pageSize)
    };
}

function validateParams(pageNumber, pageSize) {
    if (!pageNumber) {
        throw new Error("You need to define page number");
    }
    if (!pageSize) {
        throw new Error("You need to define page size");
    }
    if (pageSize < 1) {
        throw new Error("Page size has to be greater than 0");
    }
}

function getPage(array, pageNumber, pageSize) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}
function getPageInfo(array, pageNumber, pageSize) {
    const firstPageNumber = 1;
    const lastPageNumber = Math.ceil(array.length / pageSize);
    const previousPageNumber =
        pageNumber > firstPageNumber ? pageNumber - 1 : null;
    const nextPageNumber = pageNumber < lastPageNumber ? pageNumber + 1 : null;
    return {
        currentPageNumber: pageNumber,
        previousPageNumber,
        nextPageNumber,
        firstPageNumber,
        lastPageNumber
    };
}

module.exports = { paginate };
