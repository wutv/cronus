const { readdirSync } = require("fs"),
 { resolve } = require("path");
 
function exportAll(directories) {
    const exported = {};
    for (const dir of directories) {
        for (const file of readdirSync(resolve(dir))) exported[file] = require(resolve(dir, file));
    }
    module.exports = exported;
};

exportAll(["./src/build", "./src/util"]);