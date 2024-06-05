const DatabaseError = require("./Error");
const path = require("path");
const { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } = require("fs");
const { set, get, unset } = require("lodash");

/**
 * @type {JsonDatabase<V>}
 * @template V
 */
class JsonDatabase {
    /**
     * @param {import("./Types/IOptions").IOptions} options
     * @constructor
     */
    constructor({ databasePath = "databases/db.json", maxDataSize = null } = {}) {
        if (maxDataSize !== null && typeof maxDataSize !== "number") {
            throw new DatabaseError("The maximum limit must be in number type!");
        }

        if (maxDataSize !== null && maxDataSize < 1) {
            throw new DatabaseError("Inappropriate range for the limit!");
        }

        let basePath = process.cwd();
        if (databasePath.startsWith(basePath)) {
            databasePath = databasePath.replace(basePath, "");
        }

        if (databasePath.startsWith(`.${path.sep}`)) {
            databasePath = databasePath.slice(1);
        }

        if (!databasePath.startsWith(path.sep)) {
            databasePath = path.sep + databasePath;
        }

        if (!databasePath.endsWith(".json")) {
            if (databasePath.endsWith(path.sep)) {
                databasePath += "db.json";
            } else {
                databasePath += ".json";
            }
        }

        basePath = `${basePath}${databasePath}`;

        const dirNames = databasePath.split(path.sep).slice(1);

        const length = dirNames.length;

        if (length > 1) {
            dirNames.pop();

            const firstResolvedDir = path.resolve(dirNames[0]);

            if (!existsSync(firstResolvedDir)) {
                mkdirSync(firstResolvedDir);
            }

            dirNames.splice(0, 1);

            let targetDirPath = firstResolvedDir;

            for (const dirName of dirNames) {
                const currentPath = `${targetDirPath}${path.sep}${dirName}`;

                if (!existsSync(currentPath)) {
                    mkdirSync(currentPath);
                }

                targetDirPath = `${targetDirPath}${path.sep}${dirName}`;
            }
        }

        this.path = basePath;

        if (!existsSync(this.path)) {
            writeFileSync(this.path, "{}");
        }

        /**
         * @type {number}
         */
        this.maxDataSize = maxDataSize;

        this.size = 0;
    }

    /**
     *
     * @param {string} key Key
     * @param {V} value Value
     * @param {boolean} [autoWrite=true] Automatic write setting.
     * @example db.set("test",3);
     */
    set(key, value, autoWrite = true) {
        if (key === "" || typeof key !== "string") {
            throw new DatabaseError("Unapproved key!");
        }

        if (
            // @ts-ignore
            value === "" ||
            value === undefined ||
            value === null
        ) {
            throw new DatabaseError("Unapproved value!");
        }

        if (typeof autoWrite !== "boolean") {
            throw new DatabaseError("autoWrite parameter must be true or false!");
        }

        if (typeof this.maxDataSize === "number" && this.size >= this.maxDataSize) {
            throw new DatabaseError("Data limit exceeded!");
        }

        const jsonData = this.toJSON();

        set(jsonData, key, value);

        if (autoWrite) writeFileSync(this.path, JSON.stringify(jsonData, null, 4));

        this.size++;

        return value;
    }

    /**
     *
     * @param {string} key Key
     * @param {V} [defaultValue=null] If there is no value, the default value to return.
     * @returns {V}
     * @example db.get("test");
     */
    get(key, defaultValue = null) {
        if (key === "" || typeof key !== "string") {
            throw new DatabaseError("Unapproved key!");
        }

        const jsonData = this.toJSON();

        const data = get(jsonData, key);
        return data === undefined ? defaultValue : data;
    }

    /**
     *
     * @param {string} key Key
     * @param {V} [defaultValue=null] If there is no value, the default value to return.
     * @returns {V}
     * @example db.get("test");
     */
    fetch(key, defaultValue) {
        return this.get(key, defaultValue);
    }

    /**
     *
     * @param {string} key Key
     * @returns {boolean}
     * @example db.exists("test");
     */
    exists(key) {
        return this.toJSON().hasOwnProperty(key);
    }

    /**
     *
     * @param {string} key Key
     * @returns {boolean}
     * @example db.has("test");
     */
    has(key) {
        return this.exists(key);
    }

    /**
     *
     * @param {number} limit Limit
     * @returns {Array<Schema<V>>}>}
     * @example db.all(5);
     */
    all(limit = 0) {
        if (typeof limit !== "number") {
            throw new DatabaseError("Must be of limit number type!");
        }

        const jsonData = JSON.parse(readFileSync(this.path, "utf-8"));

        const arr = [];
        for (const key in jsonData) {
            arr.push({
                ID: key,
                data: jsonData[key]
            });
        }

        return limit > 0 ? arr.splice(0, limit) : arr;
    }

    /**
     *
     * @param {number} [limit] Limit
     * @returns {Array<Schema<V>>}
     * @example db.fetchAll(5);
     */
    fetchAll(limit) {
        return this.all(limit);
    }

    /**
     *
     * @param {number} [limit] Limit
     * @returns {{[key:string]:V}}
     * @example db.toJSON();
     */
    toJSON(limit) {
        const allData = this.all(limit);
        /**
         * @type {{[key:string]:V}}
         */
        const json = {};
        for (const element of allData) {
            json[element.ID] = element.data;
        }
        return json;
    }

    /**
     *
     * @param {string} key Key
     * @param {boolean} autoWrite Automatic write setting.
     * @returns {void}
     * @example db.delete("test");
     */
    delete(key, autoWrite = true) {
        if (key === "" || typeof key !== "string") {
            throw new DatabaseError("Unapproved key!");
        }

        if (typeof autoWrite !== "boolean") {
            throw new DatabaseError("autoWrite parameter must be true or false!");
        }

        const jsonData = this.toJSON();

        this.size--;
        unset(jsonData, key);

        if (autoWrite) writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
        return;
    }

    /**
     *
     * @returns {void}
     * @example db.deleteAll();
     */
    deleteAll() {
        writeFileSync(this.path, "{}");
        this.size = 0;
        return;
    }

    /**
     * @param {string} key Key
     * @returns {"string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function"}
     * @example db.type("test");
     */
    type(key) {
        const data = this.get(key);
        if (Array.isArray(data)) return "array";
        else return typeof data;
    }

    /**
     *
     * @param {string} key Key
     * @param {boolean} multiple Whether to target multiple targets.
     * @param {(element,index,array) => boolean} callbackfn Value
     * @param {any} [thisArg]
     * @returns {any}
     * @example db.pull("test","hello");
     */
    pull(key, callbackfn, multiple = false, thisArg) {
        let data = this.get(key);
        if (!data) return false;
        if (!Array.isArray(data)) throw new DatabaseError(`${key} It is not a data string with an ID.`);
        if (typeof multiple !== "boolean") {
            throw new DatabaseError("multiple parameter must be true or false!");
        }
        if (thisArg) callbackfn = callbackfn.bind(thisArg);

        const length = data.length;

        if (multiple) {
            const newArray = [];

            for (let i = 0; i < length; i++) {
                if (!callbackfn(data[i], i, data)) {
                    newArray.push(data[i]);
                }
            }
            // @ts-ignore
            return this.set(key, newArray);
        } else {
            const index = data.findIndex(callbackfn);
            data.splice(index, 1);
        }

        return this.set(key, data);
    }

    /**
     *
     * @returns {V[]} Values[]
     * @example db.valueArray();
     */
    valueArray() {
        const all = this.all();
        return all.map((element) => element.data);
    }

    /**
     *
     * @returns {string[]} ID[]
     * @example db.keyArray();
     */
    keyArray() {
        const all = this.all();
        return all.map((element) => element.ID);
    }

    /**
     *
     * @param {string} key Key
     * @param {"+" | "-" | "*" | "/" | "%"} operator Operator
     * @param {number|string} value Value
     * @param {boolean} [goToNegative] Verinin -'lere düşüp düşmeyeceği. (default false)
     * @returns {any}
     * @example db.math("test","/",5,false);
     */
    math(key, operator, value, goToNegative = false) {
        // @ts-ignore
        if (Array.isArray(value) || isNaN(value)) {
            throw new DatabaseError(`The type of value is not a number.`);
        }

        if (value <= 0) throw new DatabaseError(`Value cannot be less than 1.`);
        value = Number(value);
        if (typeof goToNegative !== "boolean") throw new DatabaseError(`The goToNegative parameter must be of boolean type.`);
        let data = this.get(key);
        if (!data) {
            // @ts-ignore
            return this.set(key, value);
        }
        // @ts-ignore
        if (Array.isArray(data) || isNaN(data)) throw new DatabaseError(`${key} ID data is not a number type data.`);

        // @ts-ignore
        data = Number(data);
        switch (operator) {
            case "+":
                // @ts-ignore
                data += value;
                break;
            case "-":
                // @ts-ignore
                data -= value;
                // @ts-ignore
                if (goToNegative === false && data < 1) data = 0;
                break;
            case "*":
                // @ts-ignore
                data *= value;
                break;
            case "/":
                // @ts-ignore
                data /= value;
                break;
            case "%":
                // @ts-ignore
                data %= value;
                break;
        }
        return this.set(key, data);
    }

    /**
     *
     * @param {string} key Key
     * @param {number} value Value
     * @returns {any}
     * @example db.add("test",5,false);
     */
    add(key, value) {
        return this.math(key, "+", value);
    }

    /**
     *
     * @param {string} key Key
     * @param {number} value Value
     * @param {boolean} [goToNegative] Eksilere düşüp düşmeyeceği
     * @returns {any}
     * @example db.substr("test",2,false);
     */
    substr(key, value, goToNegative) {
        return this.math(key, "-", value, goToNegative);
    }

    /**
     *
     * @param {string} key Key
     * @param {any} value Value
     * @returns {V}
     * @example db.push("test","succes");
     */
    push(key, value) {
        const data = this.get(key);
        if (!data) {
            // @ts-ignore
            return this.set(key, [value]);
        }
        if (Array.isArray(data)) {
            data.push(value);
            return this.set(key, data);
        } else {
            // @ts-ignore
            return this.set(key, [value]);
        }
    }

    /**
     *
     * @param {string} key Key
     * @returns {Array<Schema<V>>}
     * @example db.includes("te");
     */
    includes(key) {
        return this.filter((element) => element.ID.includes(key));
    }

    /**
     *
     * @param {string} key Key
     * @returns {Array<Schema<V>>}
     * @example db.startsWith("te");
     */
    startsWith(key) {
        return this.filter((element) => element.ID.startsWith(key));
    }

    /**
     * @param {(value:Schema<V>,index:number,array:Array<Schema<V>>) => boolean} callbackfn
     * @param {any} [thisArg]
     */
    filter(callbackfn, thisArg) {
        if (thisArg) callbackfn = callbackfn.bind(thisArg);
        return this.all().filter(callbackfn);
    }

    /**
     * @param {(a:Schema<V>,b:Schema<V>) => number} callbackfn
     * @param {any} [thisArg]
     */
    sort(callbackfn, thisArg) {
        if (thisArg) callbackfn = callbackfn.bind(thisArg);
        return this.all().sort(callbackfn);
    }

    /**
     *
     * @returns {void}
     */
    destroy() {
        return unlinkSync(this.path);
    }

    /**
     *
     * @param {(element:{ID:string,data:V},provider:this) => boolean} callbackfn
     * @param {any} [thisArg]
     * @returns {number}
     */
    findAndDelete(callbackfn, thisArg) {
        let deletedSize = 0;
        if (thisArg) callbackfn = callbackfn.bind(thisArg);
        const all = this.all();
        for (const element of all) {
            if (callbackfn(element, this)) {
                this.delete(element.ID);
                deletedSize++;
            }
        }
        return deletedSize;
    }

    get info() {
        return {
            size: this.size,
            version: "4.0.21"
        };
    }
}

module.exports = JsonDatabase;

/**
 * @template T
 * @typedef {Object} Schema
 * @prop {string} ID
 * @prop {T} data
 */
