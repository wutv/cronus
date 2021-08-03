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

/**
 * Resolves flags, and returns normal content without flags.
 * @param {Array} args Args you want to resolve.
 * @type {Array<Object>} flags Command flags.
 * @returns {Object<String, Any>}
 */

function resolveContent(args, flags) {
	const values = { args, flags: {} };
	if (flags)
		for (const flag of flags) {

			// eslint-disable-next-line no-inner-declarations 
			function resolveFlagStr(sep, _str, req) {
				const joinedStr = (sep || (req ? "" : flag.seperator)) + _str;
				return flag.lowercase ? joinedStr.toLowerCase() : joinedStr;
			}

			const flagStrings = [resolveFlagStr(null, flag.name)];
			if (flag.aliases)
				flagStrings.push(
					...flag.aliases.map((x) =>
						resolveFlagStr(
							...(() => {
								if (Array.isArray(x)) {
									if (x.length <= 2) return [x[0], x[1]];
									else return [null, x[0]];
								} else return [null, x];
							})(),
						),
					),
				);
			
			if (!flagStrings.some((flagString) => args.some((x) => x.includes(flagString + "=")))) continue;
			let arg, value, valueOrigi;

			for (const flagStr of flagStrings) {
				const str = args.findIndex((x) => x.includes(flagStr));
				if (str >= 0) {
					arg = [args[str], flagStr, str];
					break;
				}
			}
			
			const split = arg[0].split(arg[1] + "=");
			try {
				(value = flag.expectedType ? JSON.parse(split[1]) : split[1]), (valueOrigi = split[1]);
			} catch (e) {
				value = split[1];
				valueOrigi = split[1];
			}

			values.args[arg[2]] = values.args[arg[2]].split(`${arg[1]}=${valueOrigi}`).join(" ");
			values.args = values.args.map((x) => x.trim()).filter((x) => x);
			values.flags[flag.name] = value;
		}
	return values;
}

module.exports = { isClass, isString, isFalsey, isObjectObject, resolveContent };