"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var key_definition_1 = __importDefault(require("./key-definition"));
var constants_1 = require("../utils/constants");
var index_definition_1 = __importDefault(require("./index-definition"));
var unique_definition_1 = __importDefault(require("./unique-definition"));
var primary_definition_1 = __importDefault(require("./primary-definition"));
var Table = /** @class */ (function () {
    function Table(tableName) {
        this._keys = [];
        this._indexes = [];
        this._uniques = [];
        this._tableName = tableName;
    }
    Table.prototype.id = function (key) {
        // Get id key
        var id = key || constants_1.Keys.Id;
        // Create key definition
        var keyDefinition = new key_definition_1.default(id, 'int');
        keyDefinition.nullable(false);
        keyDefinition.increments(true);
        this._keys.push(keyDefinition);
        // Set primary key
        this.primary(id);
        // Return key definition
        return keyDefinition;
    };
    Table.prototype.timestamps = function () {
        // Loop through each timestamp and create datetime keys
        for (var _i = 0, _a = constants_1.Keys.Timestamps; _i < _a.length; _i++) {
            var timestamp = _a[_i];
            this.datetime(timestamp);
        }
    };
    Table.prototype.string = function (key, length) {
        if (length === void 0) { length = 30; }
        var keyDefinition = new key_definition_1.default(key, "varchar(" + length + ")");
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.text = function (key, length) {
        if (length === void 0) { length = 30; }
        var keyDefinition = new key_definition_1.default(key, "text");
        keyDefinition.charset('utf8mb4', 'utf8mb4_unicode_ci');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.integer = function (key) {
        var keyDefinition = new key_definition_1.default(key, 'int');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.decimal = function (key, length, precision) {
        if (length === void 0) { length = 8; }
        if (precision === void 0) { precision = 2; }
        var keyDefinition = new key_definition_1.default(key, "decimal(" + length + ", " + precision + ")");
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.double = function (key, length, precision) {
        if (length === void 0) { length = 8; }
        if (precision === void 0) { precision = 2; }
        var keyDefinition = new key_definition_1.default(key, "double(" + length + ", " + precision + ")");
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.float = function (key, length, precision) {
        if (length === void 0) { length = 8; }
        if (precision === void 0) { precision = 2; }
        var keyDefinition = new key_definition_1.default(key, "float(" + length + ", " + precision + ")");
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.pointer = function (key) {
        return this.integer(key + ("_" + constants_1.Keys.Id));
    };
    ;
    Table.prototype.boolean = function (key) {
        var keyDefinition = new key_definition_1.default(key, 'bit');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.date = function (key) {
        var keyDefinition = new key_definition_1.default(key, 'date');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.datetime = function (key) {
        var keyDefinition = new key_definition_1.default(key, 'datetime');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.json = function (key) {
        var keyDefinition = new key_definition_1.default(key, 'json');
        this._keys.push(keyDefinition);
        return keyDefinition;
    };
    Table.prototype.primary = function (key) {
        var primary = new primary_definition_1.default(key);
        this._primary = primary;
        return primary;
    };
    Table.prototype.index = function (key, alias) {
        if (alias === void 0) { alias = key; }
        var index = new index_definition_1.default(key, alias);
        this._indexes.push(index);
        return index;
    };
    Table.prototype.unique = function (key, alias) {
        if (alias === void 0) { alias = key; }
        var unique = new unique_definition_1.default(key, alias);
        this._uniques.push(unique);
        return unique;
    };
    return Table;
}());
exports.default = Table;
//# sourceMappingURL=table.js.map