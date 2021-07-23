const { Client, Message, Collection } = require("discord.js"),
    CommandError = require("../util/CommandError.js");

function isString(str) {
    return typeof str === "string";
}

module.exports = class BaseCommand {
    constructor(client, options) {
        this.constructor.validateOptions(client, options);

        /**
         * Command name.
         * @type {String}
         */

        this.name = options.name;

        /**
         * Command description.
         * @type {String}
         */

        this.description = options.description;

        if (options.permissions) {
            const { user: userP, client: clientP } = options.permissions;
            this.permissions = {};

            if (userP) {
                /**
                 * User permissions.
                 * @type {Array}
                 */

                this.permissions.user = userP;
            }
            if (clientP) {
                /**
                 * Client permissions.
                 * @type {Array}
                 */

                this.permissions.client = clientP;
            }
        }

        /**
         * Command run function.
         * @type {(message: Message, args: Array) => Promise<undefined | Promise<Message>> | void}
         */

        this.run = options.run;

        if (options.subCommands) {
            /**
             * Subcommands.
             * @type {Collection}
             */

            this.subCommands = new Collection(options.subCommands.commands);
            if (options.subCommands && options.subCommands.baseAuth) this.subCommands.baseAuth = options.subCommands.baseAuth;
        }
    }
    static validateOptions(client, options) {
        /**
         * Check if client isn't provided.
         */

        if (!client) throw new CommandError("notProvided", "client");

        /**
         * Check if client isn't client.
         */

        if (!(client instanceof Client))
            throw new CommandError("typeof", {
                expected: Client,
                got: options.name,
                name: "client",
            });

        /**
         * Check if name has been provided.
         */

        if (!options.name) throw new CommandError("notProvided", "name");

        /**
         * Check if command name is a string.
         */

        if (!isString(options.name))
            throw new CommandError("typeof", {
                expected: "",
                got: options.name,
                name: "name",
            });

        /**
         * Check if description has been provided.
         */

        if (!options.description) throw new CommandError("notProvided", "client");

        /**
         * Check if description is a string.
         */

        if (!isString(options.description))
            throw new CommandError("typeof", {
                expected: "",
                got: options.description,
                name: "description",
            });

        /**
         * Check if there is a run function.
         */

        if (!options.run) throw new CommandError("notProvided", "run function");

        /**
         * Check if the run function is actually a function.
         */

        if (typeof options.run !== "function")
            throw new Error("typeof", {
                expected: Function,
                got: options.run,
                name: "run function",
            });

        /**
         * Check for aliases.
         */

        if (options.aliases) {
            if (!Array.isArray(options.aliases))
                throw new CommandError("typeof", {
                    expected: [],
                    got: options.aliases,
                    name: "aliases",
                });
            for (const ali of options.aliases) {
                if (!isString(ali))
                    throw new CommandError("typeof", {
                        expected: "",
                        got: ali,
                        name: "alias",
                    });
            }
        }

        /**
         * Check permissions.
         */

        if (options.permissions) {
            const { user: userP, client: clientP } = options.permissions;

            if (userP) {
                if (!Array.isArray(userP))
                    throw new CommandError("typeof", {
                        expected: [],
                        got: userP,
                        name: "user permissions",
                    });

                for (const perm of userP)
                    if (!isString(perm))
                        throw new CommandError("typeof", {
                            expected: "",
                            got: perm,
                            name: "user permission",
                        });
            }
            if (clientP) {
                if (!Array.isArray(clientP))
                    throw new CommandError("typeof", {
                        expected: [],
                        got: userP,
                        name: "client permissions",
                    });

                for (const perm of clientP)
                    if (!isString(perm))
                        throw new CommandError("typeof", {
                            expected: "",
                            got: perm,
                            name: "client permission",
                        });
            }
        }

        /**
         * Check subcommands.
         */

        if (options.subCommands) {
            const { commands: subC } = subCommands;
            if (!subC) throw new CommandError("notProvided", "sub commands");
            if (!Array.isArray(subC))
                throw new CommandError("typeof", {
                    expected: [],
                    got: subC,
                    name: "subcommands",
                });

            for (const subRaw of subC) {
                
                if (!Array.isArray(subRaw))
                throw new CommandError("typeof", {
                    expected: [],
                    got: subRaw,
                    name: "subcommand",
                });

                const [name, subRun] = rubRaw;

                if (!isString(name))
                    throw new CommandError("typeof", {
                        expected: "",
                        got: name,
                        name: "subcommand",
                    });

                if (typeof subRun !== "function")
                    throw new CommandError("typeof", {
                        expected: Function,
                        got: name,
                        name: "subcommand",
                    });
            }
        }
    }
};
