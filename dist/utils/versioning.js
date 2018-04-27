"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var constants_1 = require("./constants");
var Versioning = /** @class */ (function () {
    function Versioning(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }
    Object.defineProperty(Versioning.prototype, "fileSafe", {
        get: function () {
            return [this.major, this.minor, this.patch].join(constants_1.Delimiters.FileSafe);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Versioning.prototype, "standard", {
        get: function () {
            return [this.major, this.minor, this.patch].join(constants_1.Delimiters.Standard);
        },
        enumerable: true,
        configurable: true
    });
    return Versioning;
}());
exports.default = Versioning;
var getVersionString = function (str) {
    return str.split(constants_1.Delimiters.Separator)[0].slice(1);
};
var getVersionParts = function (str) {
    return str.split(constants_1.Delimiters.FileSafe).map(function (part) { return parseInt(part); });
};
exports.getNextVersion = function (dir, versionType) {
    // Get latest version
    var versions = fs_1.default.readdirSync(dir);
    var latestVersion = versions.length === 0 ?
        "v1" + constants_1.Delimiters.FileSafe + "0" + constants_1.Delimiters.FileSafe + "-1" + constants_1.Delimiters.Separator :
        versions.sort(function (vPrev, vCurr) { return vPrev > vCurr ? -1 : 1; })[0];
    // Get version parts
    var _a = getVersionParts(getVersionString(latestVersion)), major = _a[0], minor = _a[1], patch = _a[2];
    // Return next version
    switch (versionType) {
        case 'major': return new Versioning(major + 1, 0, 0);
        case 'minor': return new Versioning(major, minor + 1, 0);
        case 'patch':
        default: return new Versioning(major, minor, patch + 1);
    }
};
//# sourceMappingURL=versioning.js.map