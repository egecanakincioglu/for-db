declare module "for.db" {
    export class JsonDatabase<V> {
        private cache: { [key: string]: V };
        public path: string;
        public maxDataSize: number;
        public size: number;
        public constructor({ }?: IOptions);
        public set(key: string, value: V, autoWrite?: boolean): V;
        public get(key: string, defaultValue?: V): V;
        public fetch(key: string, defaultValue?: V): V;
        public exists(key: string): boolean;
        public has(key: string): boolean;
        public all(limit?: number): Array<Schema<V>>;
        public fetchAll(limit?: number): Array<Schema<V>>;
        public toJSON(limit?: number): { [key: string]: V };
        public delete(key: string, autoWrite?: boolean): void;
        public deleteAll(): void;
        public type(key: string): "string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function";
        public pull(key: string, callbackfn: (element: any, index: number, array: Array<any>) => boolean, multiple?: boolean, thisArg?: any): V;
        public valueArray(): V[];
        public keyArray(): string[];
        public math(key: string, operator: "+" | "-" | "*" | "/" | "%", value: number, goToNegative?: boolean): V;
        public add(key: string, value: V): V;
        public substr(key: string, value: V, goToNegative?: boolean): V;
        public push(key: string, value: any): V;
        public includes(key: string): Array<Schema<V>>;
        public startsWith(key: string): Array<Schema<V>>;
        public filter(callbackfn: (value: Schema<V>, index: number, array: Array<Schema<V>>) => boolean, thisArg?: any): Array<Schema<V>>;
        public sort(callbackfn: (a: Schema<V>, b: Schema<V>) => number, thisArg?: any): Array<Schema<V>>;
        public destroy(): void;
        public findAndDelete(callbackfn: (key: string, value: V) => boolean, thisArg?: any): number;
        public get info(): IInfo;
    }

    export class YamlDatabase<V> {
        private cache: { [key: string]: V };
        public path: string;
        public maxDataSize: number;
        public size: number;
        public constructor({ }?: IOptions);
        public set(key: string, value: V, autoWrite?: boolean): V;
        public get(key: string, defaultValue?: V): V;
        public fetch(key: string, defaultValue?: V): V;
        public exists(key: string): boolean;
        public has(key: string): boolean;
        public all(limit?: number): Array<Schema<V>>;
        public fetchAll(limit?: number): Array<Schema<V>>;
        public toJSON(limit?: number): { [key: string]: V };
        public delete(key: string, autoWrite?: boolean): void;
        public deleteAll(): void;
        public type(key: string): "string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function";
        public pull(key: string, callbackfn: (element: any, index: number, array: Array<any>) => boolean, multiple?: boolean, thisArg?: any): V;
        public valueArray(): V[];
        public keyArray(): string[];
        public math(key: string, operator: "+" | "-" | "*" | "/" | "%", value: number, goToNegative?: boolean): V;
        public add(key: string, value: V): V;
        public substr(key: string, value: V, goToNegative?: boolean): V;
        public push(key: string, value: any): V;
        public includes(key: string): Array<Schema<V>>;
        public startsWith(key: string): Array<Schema<V>>;
        public filter(callbackfn: (value: Schema<V>, index: number, array: Array<Schema<V>>) => boolean, thisArg?: any): Array<Schema<V>>;
        public sort(callbackfn: (a: Schema<V>, b: Schema<V>) => number, thisArg?: any): Array<Schema<V>>;
        public destroy(): void;
        public findAndDelete(callbackfn: (key: string, value: V) => boolean, thisArg?: any): number;
        public get info(): IInfo;
    }

    export class DatabaseError extends Error {
        public constructor(message: string);
        public get name(): string;
    }

    export interface Schema<T> {
        ID: string;
        data: T
    }
    
    export interface IOptions {
        maxDataSize?: number;
        databasePath?: string;
    }

    export interface IInfo {
        version: string;
        size: number;
    }
}