const JsonDatabase = require("./src/JsonProvider");
const DatabaseError = require("./src/Error");
const YamlDatabase = require("./src/YamlProvider");

module.exports = {
    JsonDatabase,
    YamlDatabase,
    DatabaseError
};