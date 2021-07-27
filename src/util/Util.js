/**
 * Finds out if a value is a class.
 * @param {any} obj Value to test.
 * @returns {Boolean}
 */

function isClass(obj) {
    const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
    if (obj.prototype === undefined) {
        return isCtorClass;
    }
    const isPrototypeCtorClass =
        obj.prototype.constructor &&
        obj.prototype.constructor.toString &&
        obj.prototype.constructor.toString().substring(0, 5) === "class";
    return isCtorClass || isPrototypeCtorClass;
}

/**
 * Determines whether a value is a string.
 * @param {any} str The value to determine via.
 * @returns {Boolean}
 */

function isString(str) {
    // this is just a faster method of doing it. I don't want to have `typeof str === "string"` everywhere I want to check if something is a string.
    return typeof str === "string";
}

/**
 * Determines whether a value is undefined, null, or false.
 * @param {any} i
 * @returns {Boolean}
 */

 function isFalsey(i) {
    return [undefined, null, false].includes(i);
}

/**
 * Determines whether a string is "[object Object]".
 * @param {String} input
 * @returns {Boolean}
 */

 function isObjectObject(input) {
    return input === "[object Object]";
}

module.exports = { isClass, isString, isFalsey, isObjectObject };