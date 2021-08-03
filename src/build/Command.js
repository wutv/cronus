const { Message, Collection, Client } = require("discord.js"),
	CommandError = require("../util/CommandError.js"),
	{ isString } = require("../util/Util.js");

class Command {
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

		/**
		 * Expected arguments.
		 * @type {Array<Array<String, String>>}
		 */

		this.expectedArgs = options.args;

		const baseFlags = options.flags;
		if (baseFlags) {
			let newFlags = baseFlags.map((flag) => ({
				name: flag.name,
				expectedType: flag.expectedType || "string",
				seperator: flag.seperator || "-",
			}));

			if (!newFlags)
				newFlags = [
					{
						name: "flags",
						expectedType: "string",
						seperator: ["--", "-"],
					},
				];

			/**
			 * Command flags.
			 * @type {?Array<Object<String, any>>}
			 */

			this.flags = newFlags;
		}

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

		if (options.subCommands) {
			/**
			 * Subcommands.
			 * @type {Collection}
			 */

			this.subCommands = new Collection(options.subCommands.commands);
			if (options.subCommands && options.subCommands.baseAuth) this.subCommands.baseAuth = options.subCommands.baseAuth;
		}
	}

	/**
	 * Run the command.
	 * @param {Message} message Message that triggered this command.
	 * @param {Array | void} args Command input.
	 * @param {Object<String, String | Boolean | Number> | void} flags Command flags.
	 * @returns {?Promise<Message>}
	 */

	run(message, args, flags) {
		if (!(message instanceof Message)) throw new CommandError("typeof", {
			expected: Message,
			got: message,
			name: "run function message param"
		});
		// Do something with args.
		args;

		if (message) {
			message.channel.send({
				embeds: [
					{
						author: { title: "An Error Occured.", avatarURL: message.author.displayAvatarURL() },
						description: "This command doesn't have a run method. Please report this to the developers.",
					},
				],
				footer: {
					text: flags.flags === "true" ? `${message.member.displayName} | Flags valid.` : message.member.displayName,
				},
			});
		}

		throw new CommandError("typeof", {
			expected: Function,
			got: undefined,
			name: "run function",
		});
	}

	/**
	 *
	 * @param {Client} client
	 * @param {Object} options
	 */

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
		 * Flags.
		 */
		const commandFlags = options.flags;
		if (!Array.isArray(commandFlags))
			throw new CommandError("typeof", {
				expected: [],
				got: commandFlags,
				name: "command flags",
			});

		for (const flag of commandFlags) {
			if (typeof flag !== "object")
				throw new CommandError("typeof", {
					expected: Object,
					got: flag,
					name: "command flag",
				});
			if (!flag.name) throw new CommandError("notProvided", "command flag name");
			const seperator = flag.seperator;
			if (seperator && !isString(seperator))
				throw new CommandError("typeof", {
					expected: String
				});
		}

		/**
		 * Check subcommands.
		 */

		if (options.subCommands) {
			const { commands: subC } = options.subCommands;
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

				const [name, subRun] = subRaw;

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
}

class PingCommand extends Command {
	constructor(client) {
		super(client, {});
	}
}
new PingCommand(new Client({ intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"] }), {});
