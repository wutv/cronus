const { readdirSync } = require("fs"),
	{ resolve } = require("path");

function exportAll(directories) {
	const exported = {};
	for (const dir of directories) {
		for (const file of readdirSync(resolve(dir)).filter(file => [".js", ".json"].some(ends => file.endsWith(ends)))) exported[file] = require(resolve(dir, file));
	}
	module.exports = exported;
}

exportAll(["./src/build", "./src/util"]);
