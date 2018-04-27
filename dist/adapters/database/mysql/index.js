"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __importDefault(require("./client"));
var common_tags_1 = require("common-tags");
var enforce_js_1 = __importDefault(require("enforce-js"));
var table_1 = __importDefault(require("../../../classes/table"));
var MySQLDatabaseAdapter = /** @class */ (function () {
    /**
     * Constructor
     * @param {Object} config
     */
    function MySQLDatabaseAdapter(config) {
        this.Transaction = /** @class */ (function () {
            function class_1() {
                var _this = this;
                this._scripts = ['SET autocommit = 0;', 'START TRANSACTION;'];
                this.create = function (tableName, definition) {
                    // Enforce
                    enforce_js_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { tableName: tableName });
                    enforce_js_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " as a function"], ["", " as a function"])), { definition: definition });
                    // Prepare statement
                    var statement = new CreateStatement(tableName, client_1.default);
                    // Bind table
                    definition = definition.bind(statement.table);
                    // Run definition
                    definition(statement.table);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.alter = function (tableName, definition) {
                    // Enforce
                    enforce_js_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { tableName: tableName });
                    enforce_js_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " as a function"], ["", " as a function"])), { definition: definition });
                    // Prepare statement
                    var statement = new AlterStatement(tableName, client_1.default);
                    // Bind table
                    definition = definition.bind(statement.table);
                    // Run definition
                    definition(statement.table);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.drop = function (tableName) {
                    // Enforce
                    enforce_js_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { tableName: tableName });
                    // Prepare statement
                    var statement = new DropStatement(tableName, client_1.default);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.seed = function (tableName, seeds) {
                    // Enforce
                    enforce_js_1.default(templateObject_6 || (templateObject_6 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { tableName: tableName });
                    enforce_js_1.default(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", " as an array"], ["", " as an array"])), { seeds: seeds });
                    // Prepare statement
                    var statement = new SeedStatement(tableName, seeds, client_1.default);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.truncate = function (tableName) {
                    // Enforce
                    enforce_js_1.default(templateObject_8 || (templateObject_8 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { tableName: tableName });
                    // Prepare statement
                    var statement = new TruncateStatement(tableName, client_1.default);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.execute = function (query) {
                    // Enforce
                    enforce_js_1.default(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { query: query });
                    // Prepare statement
                    var statement = new ExecuteStatement(query);
                    // Add the statement
                    _this._scripts.push(statement.toString());
                };
                this.escape = function (value) {
                    // Enforce
                    enforce_js_1.default(templateObject_10 || (templateObject_10 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { value: value });
                    // Return escaped value
                    return client_1.default.escape(value);
                };
                this.escapeKey = function (key) {
                    // Enforce
                    enforce_js_1.default(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", " as a string"], ["", " as a string"])), { key: key });
                    // Return escaped key
                    return client_1.default.escapeKey(key);
                };
            }
            class_1.prototype.commit = function () {
                // Add commit statement
                this._scripts.push('COMMIT;');
            };
            class_1.prototype.toString = function () {
                return this._scripts.join('\n\n');
            };
            return class_1;
        }());
        // Prepare parameters
        this._client = new client_1.default(config);
    }
    MySQLDatabaseAdapter.prototype.query = function (statement) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.query(statement)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MySQLDatabaseAdapter;
}());
exports.default = MySQLDatabaseAdapter;
var CreateStatement = /** @class */ (function () {
    function CreateStatement(tableName, client) {
        this._table = new table_1.default(tableName);
        this._client = client;
    }
    Object.defineProperty(CreateStatement.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    CreateStatement.prototype._getKeyOptions = function (key) {
        return [
            key._nullable ? '' : 'NOT NULL',
            key._increments ? 'AUTO_INCREMENT' : '',
            key._charset ? "CHARSET " + key._charset : '',
            key._collation ? "COLLATE " + key._collation : ''
        ].join(' ').trim();
    };
    CreateStatement.prototype._getKeys = function () {
        var _this = this;
        return this.table._keys.map(function (key) {
            return (_this._client.escapeKey(key.name) + " " + key.type + " " + _this._getKeyOptions(key)).trim();
        }).join(',\n');
    };
    CreateStatement.prototype._getPrimary = function () {
        if (this.table._primary && this.table._primary.action === 'ADD')
            return ",\nPRIMARY KEY (" + this._client.escapeKey(this.table._primary.name) + ")";
        else
            return '';
    };
    CreateStatement.prototype._getIndexes = function () {
        var _this = this;
        return this.table._indexes.length > 0 ? common_tags_1.stripIndents(templateObject_12 || (templateObject_12 = __makeTemplateObject([",\n            ", "\n        "], [",\n            ",
            "\n        "])), this.table._indexes
            .filter(function (index) { return index.action === 'ADD'; })
            .map(function (index) { return "INDEX " + _this._client.escapeKey(index.alias) + " (" + _this._client.escapeKey(index.name) + ")"; }).join(',\n')) : '';
    };
    CreateStatement.prototype._getUniques = function () {
        var _this = this;
        return this.table._uniques.length > 0 ? common_tags_1.stripIndents(templateObject_13 || (templateObject_13 = __makeTemplateObject([",\n            ", "\n        "], [",\n            ",
            "\n        "])), this.table._uniques
            .filter(function (unique) { return unique.action === 'ADD'; })
            .map(function (unique) { return "CONSTRAINT " + _this._client.escapeKey(unique.alias) + " UNIQUE (" + _this._client.escapeKey(unique.name) + ")"; })
            .join('\n')) : '';
    };
    CreateStatement.prototype.toString = function () {
        return common_tags_1.stripIndents(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n            CREATE TABLE IF NOT EXISTS ", " (\n            ", "", "", "", ");\n        "], ["\n            CREATE TABLE IF NOT EXISTS ", " (\n            ", "", "", "", ");\n        "])), this._client.escapeKey(this.table._tableName), this._getKeys(), this._getPrimary(), this._getIndexes(), this._getUniques());
    };
    return CreateStatement;
}());
var AlterStatement = /** @class */ (function () {
    function AlterStatement(tableName, client) {
        this._table = new table_1.default(tableName);
        this._client = client;
    }
    Object.defineProperty(AlterStatement.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    AlterStatement.prototype._getKeyAction = function (key) {
        switch (key.action) {
            case 'ADD': return 'ADD';
            case 'MODIFY': return 'MODIFY';
            case 'DROP': return 'DROP';
        }
    };
    AlterStatement.prototype._getKeyOptions = function (key) {
        return [
            key._nullable ? '' : 'NOT NULL',
            key._increments ? 'AUTO_INCREMENT' : '',
            key._charset ? "CHARSET " + key._charset : '',
            key._collation ? "COLLATE " + key._collation : ''
        ].join(' ').trim();
    };
    AlterStatement.prototype._getKeys = function () {
        var _this = this;
        return this.table._keys.map(function (key) {
            var keyName = _this._client.escapeKey(key.name);
            var options = _this._getKeyOptions(key);
            if (_this._getKeyAction(key) === 'DROP')
                return "DROP COLUMN " + keyName;
            else
                return (_this._getKeyAction(key) + " COLUMN " + keyName + " " + key.type + " " + options).trim();
        }).join(',\n');
    };
    AlterStatement.prototype._getPrimary = function () {
        if (this._table._primary && this._table._primary.action === 'ADD')
            return ",\nADD PRIMARY KEY (" + this._client.escapeKey(this.table._primary.name) + ")";
        else if (this._table._primary && this._table._primary.action === 'DROP')
            return ",\nDROP PRIMARY KEY";
        else
            return '';
    };
    AlterStatement.prototype._getIndexes = function () {
        var _this = this;
        return this.table._indexes.length > 0 ? common_tags_1.stripIndents(templateObject_15 || (templateObject_15 = __makeTemplateObject([",\n            ", "\n        "], [",\n            ",
            "\n        "])), this.table._indexes.map(function (index) {
            if (index.action === 'ADD')
                return "ADD INDEX " + _this._client.escapeKey(index.alias) + " (" + _this._client.escapeKey(index.name) + ")";
            else
                return "DROP INDEX " + _this._client.escapeKey(index.alias);
        }).join(',\n')) : '';
    };
    AlterStatement.prototype._getUniques = function () {
        var _this = this;
        return this.table._uniques.length > 0 ? common_tags_1.stripIndents(templateObject_16 || (templateObject_16 = __makeTemplateObject([",\n            ", "\n        "], [",\n            ",
            "\n        "])), this.table._uniques.map(function (unique) {
            if (unique.action === 'ADD')
                return "ADD CONSTRAINT " + _this._client.escapeKey(unique.alias) + " UNIQUE (" + _this._client.escapeKey(unique.name) + ")";
            else
                return "DROP INDEX " + _this._client.escapeKey(unique.alias);
        }).join(',\n')) : '';
    };
    AlterStatement.prototype.toString = function () {
        return common_tags_1.stripIndents(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n            ALTER TABLE `", "`\n            ", "", "", "", ";\n        "], ["\n            ALTER TABLE \\`", "\\`\n            ", "", "", "", ";\n        "])), this.table._tableName, this._getKeys(), this._getPrimary(), this._getIndexes(), this._getUniques());
    };
    return AlterStatement;
}());
var DropStatement = /** @class */ (function () {
    function DropStatement(tableName, client) {
        this._table = new table_1.default(tableName);
        this._client = client;
    }
    Object.defineProperty(DropStatement.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    DropStatement.prototype.toString = function () {
        return common_tags_1.stripIndents(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n            DROP TABLE IF EXISTS ", ";\n        "], ["\n            DROP TABLE IF EXISTS ", ";\n        "])), this._client.escapeKey(this.table._tableName));
    };
    ;
    return DropStatement;
}());
var SeedStatement = /** @class */ (function () {
    function SeedStatement(tableName, seeds, client) {
        this._table = new table_1.default(tableName);
        this._seeds = seeds;
        this._client = client;
    }
    Object.defineProperty(SeedStatement.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    SeedStatement.prototype._getSeeds = function () {
        var seedList = [];
        var isFirst = true;
        var seedKeys = [];
        for (var _i = 0, _a = this._seeds; _i < _a.length; _i++) {
            var seed = _a[_i];
            // Get the list of keys from the first item
            if (isFirst) {
                seedKeys = seedKeys.concat(Object.keys(seed));
                isFirst = false;
            }
            // Prepare key values
            var keyValues = [];
            for (var _b = 0, seedKeys_1 = seedKeys; _b < seedKeys_1.length; _b++) {
                var key = seedKeys_1[_b];
                var value = seed[key];
                keyValues.push(value ? "'" + value + "'" : 'NULL');
            }
            // Concatenate key values
            seedList.push("(" + keyValues.join(', ') + ")");
        }
        // Return seed list
        return {
            keys: seedKeys.map(function (key) { return "`" + key + "`"; }).join(', '),
            values: seedList.join(',\n')
        };
    };
    SeedStatement.prototype.toString = function () {
        var _a = this._getSeeds(), keys = _a.keys, values = _a.values;
        return common_tags_1.stripIndents(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n            INSERT INTO ", "\n            (", ")\n            VALUES\n            ", ";\n        "], ["\n            INSERT INTO ", "\n            (", ")\n            VALUES\n            ", ";\n        "])), this._client.escapeKey(this.table._tableName), keys, values);
    };
    return SeedStatement;
}());
var TruncateStatement = /** @class */ (function () {
    function TruncateStatement(tableName, client) {
        this._table = new table_1.default(tableName);
        this._client = client;
    }
    Object.defineProperty(TruncateStatement.prototype, "table", {
        get: function () {
            return this._table;
        },
        enumerable: true,
        configurable: true
    });
    TruncateStatement.prototype.toString = function () {
        return common_tags_1.stripIndents(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n            TRUNCATE TABLE ", ";\n        "], ["\n            TRUNCATE TABLE ", ";\n        "])), this._client.escapeKey(this.table._tableName));
    };
    return TruncateStatement;
}());
var ExecuteStatement = /** @class */ (function () {
    function ExecuteStatement(query) {
        this._query = query;
    }
    ExecuteStatement.prototype.toString = function () {
        // Created intermediate function to avoid tsc conflicts
        var indentStrip = common_tags_1.stripIndents;
        return indentStrip(this._query);
    };
    return ExecuteStatement;
}());
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
//# sourceMappingURL=index.js.map