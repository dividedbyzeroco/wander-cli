"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var semver_1 = __importDefault(require("semver"));
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
exports.getVersionString = function (str) {
    return str.split(constants_1.Delimiters.Separator)[0].slice(1);
};
exports.getVersionParts = function (str) {
    return str.split(constants_1.Delimiters.FileSafe).map(function (part) { return parseInt(part); });
};
exports.parseVersionParts = function (str) {
    return exports.getVersionParts(exports.getVersionString(str));
};
exports.compareVersions = function (vPrev, vCurr) {
    return semver_1.default.gt(vPrev.join(constants_1.Delimiters.Standard), vCurr.join(constants_1.Delimiters.Standard)) ? -1 : 1;
};
exports.getNextVersion = function (dir, versionType) {
    // Get latest version
    var versions = fs_1.default.readdirSync(dir).map(function (version) { return exports.parseVersionParts(version); });
    var sortedVersions = versions.sort(exports.compareVersions);
    var latestVersion = versions.length === 0 ? [1, 0, 1] : sortedVersions[0];
    // Get version parts
    var major = latestVersion[0], minor = latestVersion[1], patch = latestVersion[2];
    // Return next version
    switch (versionType) {
        case 'major': return new Versioning(major + 1, 0, 0);
        case 'minor': return new Versioning(major, minor + 1, 0);
        case 'patch':
        default: return new Versioning(major, minor, patch + 1);
    }
};
//# sourceMappingURL=versioning.js.map