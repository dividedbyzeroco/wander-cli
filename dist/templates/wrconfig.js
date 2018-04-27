"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_tags_1 = require("common-tags");
exports.default = (function (dir, uri) {
    return common_tags_1.stripIndent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        {\n            \"migrationsDir\": \"", "\",\n            \"environments\": {\n                \"default\": {\n                    \"databaseURI\": \"", "\"\n                }\n            }\n        }"], ["\n        {\n            \"migrationsDir\": \"", "\",\n            \"environments\": {\n                \"default\": {\n                    \"databaseURI\": \"", "\"\n                }\n            }\n        }"])), dir, uri);
});
var templateObject_1;
//# sourceMappingURL=wrconfig.js.map