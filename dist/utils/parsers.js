"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse_url_1 = __importDefault(require("parse-url"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("./constants");
var versioning_1 = __importDefault(require("./versioning"));
exports.extractVersion = function (dir, filename) {
    var versionString = filename.replace(path_1.default.join(dir, '/v'), '').replace('.js', '').split(constants_1.Delimiters.Separator)[0];
    var _a = versionString.split(constants_1.Delimiters.FileSafe).map(function (item) { return parseInt(item); }), major = _a[0], minor = _a[1], patch = _a[2];
    return new versioning_1.default(major, minor, patch);
};
exports.extractDatabaseConfig = function (databaseURI) {
    var parsedURI = parse_url_1.default(databaseURI);
    var identity = parsedURI.user.split(':');
    return {
        protocol: parsedURI.protocol,
        host: parsedURI.resource,
        port: parsedURI.port,
        user: identity[0],
        password: identity[1],
        schema: parsedURI.pathname.slice(1)
    };
};
exports.toCamelCase = function (value, delimiter) {
    if (delimiter === void 0) { delimiter = ''; }
    return value.split('_').map(function (word) { return word[0].toUpperCase() + word.slice(1); }).join(delimiter);
};
exports.toPascalCase = function (value, delimiter) {
    if (delimiter === void 0) { delimiter = ''; }
    value = exports.toCamelCase(value, delimiter);
    value = value[0].toUpperCase() + value.slice(1);
    return value;
};
exports.toSpaceSeparated = function (value) {
    return exports.toCamelCase(value, ' ').toLowerCase();
};
//# sourceMappingURL=parsers.js.map