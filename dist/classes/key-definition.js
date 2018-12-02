"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyDefinition = /** @class */ (function () {
    function KeyDefinition(key, type) {
        this._nullable = true;
        this._increments = false;
        this._name = key;
        this._type = type;
    }
    KeyDefinition.prototype.nullable = function (flag) {
        if (flag === void 0) { flag = true; }
        this._nullable = flag;
        return this;
    };
    KeyDefinition.prototype.increments = function (flag) {
        if (flag === void 0) { flag = false; }
        this._increments = flag;
        return this;
    };
    KeyDefinition.prototype.charset = function (name, collation) {
        this._charset = name;
        this._collation = collation;
        return this;
    };
    KeyDefinition.prototype.first = function (column) {
        this._first = column;
        return this;
    };
    KeyDefinition.prototype.after = function (column) {
        this._after = column;
        return this;
    };
    KeyDefinition.prototype.add = function () {
        this._action = 'ADD';
    };
    KeyDefinition.prototype.modify = function () {
        this._action = 'MODIFY';
    };
    KeyDefinition.prototype.drop = function () {
        this._action = 'DROP';
    };
    Object.defineProperty(KeyDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDefinition.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return KeyDefinition;
}());
exports.default = KeyDefinition;
//# sourceMappingURL=key-definition.js.map