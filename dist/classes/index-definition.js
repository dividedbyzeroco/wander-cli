"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexDefinition = /** @class */ (function () {
    function IndexDefinition(key) {
        this._action = 'ADD';
        this._name = key;
    }
    IndexDefinition.prototype.add = function () {
        this._action = 'ADD';
    };
    IndexDefinition.prototype.drop = function () {
        this._action = 'DROP';
    };
    Object.defineProperty(IndexDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return IndexDefinition;
}());
exports.default = IndexDefinition;
//# sourceMappingURL=index-definition.js.map