const { paginate } = require("./data/pagination");

function createDataAccess(db, search, auth) {
    const getResourceByIdAndType = (id, type) => {
        try {
            return {
                ...db.findResourceByIdAndType(id, type)
            };
        } catch (error) {
            return null;
        }
    };

    function getAllResourcesByType(resourceType) {
        return [...db.findAllResourcesByType(resourceType)];
    }

    function searchResources(searchQuery, resourceType) {
        return searchQuery.length > 0
            ? search.findResources(searchQuery, resourceType)
            : getAllResourcesByType(resourceType);
    }

    const getBookById = (id) => getResourceByIdAndType(id, "Book");
    const getAllBooks = () => getAllResourcesByType("Book");
    const searchAndPaginateBooks = (searchQuery = "", pageNumber, pageSize) => {
        const books = searchResources(searchQuery, "Book");
        return paginate(books, pageNumber, pageSize);
    };

    const getBooksByAuthorId = (authorId) =>
        getAllBooks().filter((book) => book.authorId === authorId);

    const getAuthorById = (id) => getResourceByIdAndType(id, "Author");
    const getAllAuthors = () => getAllResourcesByType("Author");
    const searchAuthors = (searchQuery = "") =>
        searchResources(searchQuery, "Author");

    const getUserById = (id) => getResourceByIdAndType(id, "User");
    const getAllUsers = () => getAllResourcesByType("User");
    const searchUsers = (searchQuery = "") =>
        searchResources(searchQuery, "User");

    const getBookCopyById = (id) => getResourceByIdAndType(id, "BookCopy");
    const getAllBookCopies = () => getAllResourcesByType("BookCopy");
    const getBookCopiesByBookId = (bookId) =>
        getAllBookCopies().filter((bookCopy) => bookCopy.bookId === bookId);
    const getBookCopiesByOwnerId = (ownerId) =>
        getAllBookCopies().filter((bookCopy) => bookCopy.ownerId === ownerId);
    const getBookCopiesByBorrowerId = (borrowerId) =>
        getAllBookCopies().filter((bookCopy) => bookCopy.borrowerId === borrowerId);

    const borrowBookCopy = (bookCopyId, borrowerId) => {
        const bookCopy = db.findResourceByIdAndType(bookCopyId, "BookCopy");
        if (!!bookCopy.borrowerId) {
            throw new Error("Cannot borrow the book copy. It is already borrowed.");
        }
        updateBookCopy(bookCopyId, {
            ...bookCopy,
            borrowerId
        });
    };

    const returnBookCopy = (bookCopyId, borrowerId) => {
        const bookCopy = db.findResourceByIdAndType(bookCopyId, "BookCopy");
        if (!bookCopy.borrowerId) {
            throw new Error("Cannot return the book copy. Nobody borrowed it.");
        }
        if (bookCopy.borrowerId !== borrowerId) {
            throw new Error(
                "Book copy can only be returned by the user who borrowed it."
            );
        }
        updateBookCopy(bookCopyId, {
            ...bookCopy,
            borrowerId: null
        });
    };

    function updateBookCopy(id, bookCopyData) {
        const { ownerId, bookId, borrowerId } = bookCopyData;
        if (!getUserById(ownerId)) {
            throw new Error(`BookCopy needs valid ownerId '${ownerId}'`);
        }
        if (!getBookById(bookId)) {
            throw new Error(`BookCopy needs valid bookId '${bookId}'`);
        }
        if (borrowerId && !getUserById(borrowerId)) {
            throw new Error(
                `BookCopy needs valid or empty borrowerId '${borrowerId}'`
            );
        }
        db.updateResource(id, "BookCopy", { ownerId, bookId, borrowerId });
    }

    function deleteBookCopy(id) {
        db.deleteResource(id, "BookCopy");
    }

    function deleteUser(id) {
        getBookCopiesByBorrowerId(id).forEach((bookCopy) =>
            returnBookCopy(bookCopy.id, id)
        );
        getBookCopiesByOwnerId(id).forEach((bookCopy) =>
            deleteBookCopy(bookCopy.id)
        );
        db.deleteResource(id, "User");
    }

    const VALID_AVATAR_COLORS = [
        "red",
        "green",
        "blue",
        "yellow",
        "magenta",
        "pink",
        "black"
    ];
    function createUser(userData) {
        const { name, email, info, password } = userData;
        if (!name || name.length < 1) {
            throw new Error("User needs valid name");
        }
        if (!email || !email.match(/@/)) {
            throw new Error("User needs valid email");
        }
        if (!info || info.length < 1) {
            throw new Error("User needs valid info");
        }
        if (!password || password.length < 5) {
            throw new Error("User needs at least 5-characters-long password");
        }
        const color =
            VALID_AVATAR_COLORS[
                Math.floor(Math.random() * VALID_AVATAR_COLORS.length)
                ];
        const avatarName = `${Math.random() > 0.5 ? "m" : "w"}${Math.ceil(
            Math.random() * 25
        )}`;
        const passwordHash = auth.hashPassword(password);
        console.log(password, passwordHash);
        return db.createResource("User", {
            name,
            email,
            info,
            passwordHash,
            avatar: {
                imagePath: `/images/avatars/${avatarName}.png`,
                color
            }
        });
    }
    function login(email, password) {
        try {
            const user = db.findResourceByFieldAndType(email, "email", "User");
            if (!auth.isPasswordCorrect(password, user.passwordHash)) {
                throw new Error("Invalid password");
            }
            return {
                currentUser: user,
                token: auth.generateAuthorizationToken(user)
            };
        } catch (error) {
            console.info("Login error: ", error.message);
            throw new Error("Invalid email or password");
        }
    }
    function updateUser(id, userData) {
        const { name, info } = userData;
        if (!name || name.length < 1) {
            throw new Error("User needs valid name");
        }
        if (!info || info.length < 1) {
            throw new Error("User needs valid info");
        }
        db.updateResource(id, "User", { name, info });
    }
    function revertToInitialData() {
        db.initDb();
    }
    return {
        getBookById,
        getAllBooks,
        getBooksByAuthorId,
        searchAndPaginateBooks,

        getAuthorById,
        getAllAuthors,
        searchAuthors,

        getUserById,
        getAllUsers,
        searchUsers,
        deleteUser,
        createUser,
        updateUser,
        login,

        getBookCopyById,
        getAllBookCopies,
        getBookCopiesByBookId,
        getBookCopiesByOwnerId,
        getBookCopiesByBorrowerId,
        borrowBookCopy,
        returnBookCopy,
        deleteBookCopy,
        updateBookCopy,

        getResourceByIdAndType,
        getAllResourcesByType,
        revertToInitialData
    };
}

module.exports = createDataAccess;
