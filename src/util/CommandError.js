const { resolveError, resolveTypeofMessage } = require("./ErrorUtil.js");

/**
 * Error types.
 * @type {Object}
 */

const options = {
    invalid: "Invalid Options Error",
    typeof: "Unexpected Typeof Error",
    notProvided: "Not provided Error",
};

/**
 * Command Options Errors.
 * @extends {Error}
 */

module.exports = class CommandError extends Error {
    constructor(type, error) {
        super(`${options[type]}(${resolveError(error, type)})`);

        Object.defineProperty(this, "type", {
            enumerable: false,
            writable: true,
        });

        /**
         * Error type.
         * @type {String}
         */

        this.type = type;

        if (this.type === "typeof") {
            /**
             * Expected input.
             * @type {String}
             */

            this.expected = resolveTypeofMessage(error.expected);

            /**
             * Value got.
             * @type {any}
             */

            this.got = resolveTypeofMessage(error.expected);
        }
    }
};
