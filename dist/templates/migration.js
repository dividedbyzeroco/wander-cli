"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_tags_1 = require("common-tags");
var parsers_1 = require("../utils/parsers");
exports.default = (function (version, name) {
    return common_tags_1.stripIndent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        module.exports = {\n            version() {\n                return '", "';\n            },\n            description() {\n                return '", "';\n            },\n            up({}) {\n\n            },\n            down({}) {\n                \n            }\n        };"], ["\n        module.exports = {\n            version() {\n                return '", "';\n            },\n            description() {\n                return '", "';\n            },\n            up({}) {\n\n            },\n            down({}) {\n                \n            }\n        };"])), version.standard, parsers_1.toSpaceSeparated(name));
});
var templateObject_1;
//# sourceMappingURL=migration.js.map