const { isClass, isFalsey, isObjectObject } = require("./Util.js");

/**
 * Resolves the type of input.
 * @param {any} stri The string to find the type of.
 * @returns {String}
 */

function resolveTypeofMessage(stri) {
    if (isClass(stri)) return stri.name;
    let str = isFalsey(stri) ? String(stri) : stri.constructor.name;
    isObjectObject(str) ? (str = "Object") : null;
    return str;
}

/**
 * Resolves the error message.
 * @param {Object | String} error
 * @param {String} type
 * @returns {String}
 */

function resolveError(error, type) {
    if (error.message && !error.expected) return error.message;
    else if (type === "typeof")
        return `Expected ${resolveTypeofMessage(error.expected)} for ${error.name}, but got ${resolveTypeofMessage(
            error.got,
        )}.`;
    else if (type === "notProvided") return `The ${error} was not provided.`;
}

module.exports = { resolveError, resolveTypeofMessage };
