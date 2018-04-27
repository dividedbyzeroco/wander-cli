"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("./mysql"));
var Database = /** @class */ (function () {
    function Database() {
    }
    /**
     * Static use
     * @param {String} protocol
     */
    Database.use = function (protocol, config) {
        // Get database protocol
        var database = this.Protocols[protocol];
        // Check if database exists
        if (typeof database === 'undefined')
            throw new Error("Database `" + protocol + "` is not supported");
        else
            return new database(config);
    };
    Database.Protocols = Object.freeze({
        'mysql': mysql_1.default
    });
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=index.js.map