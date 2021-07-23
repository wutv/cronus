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

module.exports = { isClass };
