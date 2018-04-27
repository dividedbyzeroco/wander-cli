"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UniqueDefinition = /** @class */ (function () {
    function UniqueDefinition(key) {
        this._action = 'ADD';
        this._name = key;
    }
    UniqueDefinition.prototype.add = function () {
        this._action = 'ADD';
    };
    UniqueDefinition.prototype.drop = function () {
        this._action = 'DROP';
    };
    Object.defineProperty(UniqueDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniqueDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return UniqueDefinition;
}());
exports.default = UniqueDefinition;
//# sourceMappingURL=unique-definition.js.map