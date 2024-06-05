const { YamlDatabase } = require("../index");
const assert = require("assert");

describe("Yaml class all controls", () => {
    const db = new YamlDatabase({
        databasePath: "/databases/example3/example3.yml",
        maxDataSize: 100
    });

    db.deleteAll();

    it("set", () => {
        assert.deepStrictEqual(db.set("set", 10), 10);
    });

    it("set with dots.", () => {
        assert.deepStrictEqual(db.set("set.prop", 10), 10);
    });

    it("get", () => {
        assert.deepStrictEqual(db.get("set"), { prop: 10 });
    });

    it("has", () => {
        assert.deepStrictEqual(db.has("set"), true);
    });

    it("type", () => {
        assert.deepStrictEqual(db.type("set"), "object");
    });

    it("all", () => {
        assert.deepStrictEqual(db.all(), [{ ID: "set", data: { prop: 10 } }]);
    });

    it("toJSON", () => {
        assert.deepStrictEqual(db.toJSON(), { set: { prop: 10 } });
    });

    it("math", () => {
        db.set("set.prop", 10);
        assert.deepStrictEqual(db.math("set.prop", "*", 2), 20);
    });

    it("push", () => {
        db.set("array", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.deepStrictEqual(db.push("array", 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("keyArray", () => {
        assert.deepStrictEqual(db.keyArray(), ["set", "array"]);
    });

    it("valueArray", () => {
        assert.deepStrictEqual(db.valueArray(), [{ prop: 20 }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]);
    });
});
