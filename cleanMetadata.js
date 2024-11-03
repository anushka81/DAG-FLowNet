// Utility function to convert Mongoose document to a plain object without metadata
function cleanDataIn(data) {
    if (!data || typeof data !== 'object') return new Map(); // Handle non-object data
    return new Map(Object.entries(data)); // Convert the object to a Map
}

module.exports = { cleanDataIn };