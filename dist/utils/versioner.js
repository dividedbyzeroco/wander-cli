"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Versioner = /** @class */ (function () {
    function Versioner(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }
    Object.defineProperty(Versioner.prototype, "fileString", {
        get: function () {
            return this.major + "_" + this.minor + "_" + this.patch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Versioner.prototype, "dotString", {
        get: function () {
            return this.major + "." + this.minor + "." + this.patch;
        },
        enumerable: true,
        configurable: true
    });
    return Versioner;
}());
exports.default = Versioner;
//# sourceMappingURL=versioner.js.map