"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrimaryDefinition = /** @class */ (function () {
    function PrimaryDefinition(key) {
        this._action = 'ADD';
        this._name = key;
    }
    PrimaryDefinition.prototype.add = function () {
        this._action = 'ADD';
    };
    PrimaryDefinition.prototype.drop = function () {
        this._action = 'DROP';
    };
    Object.defineProperty(PrimaryDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimaryDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return PrimaryDefinition;
}());
exports.default = PrimaryDefinition;
//# sourceMappingURL=primary-definition.js.map