function createDb(initialData) {
    let data = {};

    const listeners = [];

    function registerListener(listener) {
        listeners.push(listener);
    }

    function notifyAboutChange(change, resourceType, id) {
        listeners.forEach(listener =>
            listener.onDbChange(change, resourceType, id)
        );
    }
    initDb();

    function initDb() {
        data = initialData();
        Object.keys(data).forEach(resourceType => {
            initializeNextId(resourceType);
            notifyAboutChange("init", resourceType);
        });
    }

    function findResourceByFieldAndType(fieldValue, fieldName, resourceType) {
        const resources = findAllResourcesByType(resourceType);
        const resource = resources.find(
            resource => resource[fieldName] === fieldValue
        );
        if (!resource) {
            throw new Error(
                `Could not find resource by ${fieldName} '${fieldValue}'`
            );
        }
        return resource;
    }

    function findResourceByIdAndType(id, resourceType) {
        return findResourceByFieldAndType(id, "id", resourceType);
    }

    function findAllResourcesByType(resourceType) {
        const resources = data[resourceType];
        if (!resources) {
            throw new Error(`Unrecognized resource type '${resourceType}'`);
        }
        return resources;
    }
    function deleteResource(id, resourceType) {
        const resources = findAllResourcesByType(resourceType);
        const index = resources.findIndex(resource => resource.id === id);
        if (index < 0) {
            throw new Error(`Could not find resource by id '${id}'`);
        }
        resources.splice(index, 1);
        notifyAboutChange("delete", resourceType, id);
    }
    function updateResource(id, resourceType, resourceData) {
        const resources = findAllResourcesByType(resourceType);
        const index = resources.findIndex(resource => resource.id === id);
        if (index < 0) {
            throw new Error(`Could not find resource by id '${id}'`);
        }
        const existingResource = resources[index];
        resources[index] = {
            ...existingResource,
            ...resourceData,
            id,
            resourceType
        };
        notifyAboutChange("update", resourceType, id);
    }
    function createResource(resourceType, resourceData) {
        const resources = findAllResourcesByType(resourceType);
        const id = generateNextId(resourceType);
        const createdResource = {
            ...resourceData,
            resourceType,
            id
        };
        resources.push(createdResource);
        notifyAboutChange("create", resourceType, id);
        return createdResource;
    }
    function initializeNextId(resourceType) {
        const resources = findAllResourcesByType(resourceType);
        if (!resources.nextId) {
            resources.nextId = resources.length + 1;
        }
    }
    function generateNextId(resourceType) {
        const resources = findAllResourcesByType(resourceType);
        return `${resources.nextId++}`;
    }

    return {
        initDb,
        findAllResourcesByType,
        findResourceByFieldAndType,
        findResourceByIdAndType,
        createResource,
        updateResource,
        deleteResource,
        registerListener
    };
}
module.exports = createDb;
