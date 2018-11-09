"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var commander_1 = __importDefault(require("commander"));
var chalk_1 = __importDefault(require("chalk"));
var promptly_1 = __importDefault(require("promptly"));
var rimraf_1 = __importDefault(require("rimraf"));
var common_tags_1 = require("common-tags");
var migration_1 = __importDefault(require("./templates/migration"));
var constants_1 = require("./utils/constants");
var versioning_1 = require("./utils/versioning");
var files_1 = require("./utils/files");
var validators_1 = require("./utils/validators");
var database_1 = __importDefault(require("./adapters/database"));
var parsers_1 = require("./utils/parsers");
exports.default = (function () {
    // Initialize the program
    commander_1.default
        .version(require('../package.json').version)
        .description(chalk_1.default.yellow('Database Migrations for Modern Apps'));
    // Initialize wander
    commander_1.default
        .command('init')
        .description('initialize directory')
        .action(function () { return __awaiter(_this, void 0, void 0, function () {
        var dir, confirmOverride, uri, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Start
                    console.log();
                    console.log(chalk_1.default.blue("[INFO] Initializing " + chalk_1.default.yellow('wander') + "..."));
                    return [4 /*yield*/, promptly_1.default.prompt(chalk_1.default.blue("[INFO] Enter a path for your migrations directory [" + constants_1.Directories.Migrations + "]: "), { retry: false, default: constants_1.Directories.Migrations })];
                case 1:
                    dir = _a.sent();
                    if (!fs_1.default.existsSync(dir)) return [3 /*break*/, 3];
                    return [4 /*yield*/, promptly_1.default.confirm(chalk_1.default.yellow("[WARN] Directory '" + dir + "' already exists! Do you want to override it?"), { retry: false })];
                case 2:
                    confirmOverride = _a.sent();
                    if (confirmOverride) {
                        rimraf_1.default.sync(dir);
                        fs_1.default.mkdirSync(dir);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    fs_1.default.mkdirSync(dir);
                    _a.label = 4;
                case 4: return [4 /*yield*/, promptly_1.default.prompt(chalk_1.default.blue('[INFO] Enter your database URI: '), { retry: false })];
                case 5:
                    uri = _a.sent();
                    config = files_1.getConfig();
                    config.migrationsDir = dir;
                    config.environments[constants_1.Environments.Default] = {
                        databaseURI: uri
                    };
                    config.currentEnvironment = constants_1.Environments.Default;
                    // Write config
                    files_1.writeToConfig(config);
                    // Write gitignore
                    files_1.writeToGitIgnore();
                    // Finish initializing
                    console.log();
                    console.log(chalk_1.default.green("[DONE] Successfully initialized " + chalk_1.default.yellow('wander') + "!"));
                    console.log();
                    return [2 /*return*/];
            }
        });
    }); });
    // Change environment
    commander_1.default
        .command('env')
        .description('change environment')
        .action(function () { return __awaiter(_this, void 0, void 0, function () {
        var config, env, uri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Start
                    console.log();
                    console.log(chalk_1.default.blue("[INFO] Changing " + chalk_1.default.yellow('wander') + " environment..."));
                    config = files_1.getConfig();
                    return [4 /*yield*/, promptly_1.default.prompt(chalk_1.default.blue("[INFO] Enter the name of the environment you want to switch to [" + config.currentEnvironment + "]: "), { retry: false, default: config.currentEnvironment })];
                case 1:
                    env = _a.sent();
                    if (!(typeof config.environments[env] === 'undefined')) return [3 /*break*/, 3];
                    return [4 /*yield*/, promptly_1.default.prompt(chalk_1.default.blue('[INFO] Environment is not yet defined. Enter its database URI: '), { retry: false })];
                case 2:
                    uri = _a.sent();
                    // Create the new environment
                    config.environments[env] = {
                        databaseURI: uri
                    };
                    _a.label = 3;
                case 3:
                    // Prepare config
                    config.currentEnvironment = env;
                    // Write config
                    files_1.writeToConfig(config);
                    // Finish changing environments
                    console.log();
                    console.log(chalk_1.default.green("[DONE] Successfully changed " + chalk_1.default.yellow('wander') + " environment!"));
                    console.log();
                    return [2 /*return*/];
            }
        });
    }); });
    // Creating a new migration
    commander_1.default
        .command('new <name>')
        .description('create a new migration')
        .option('-t, --version-type [type]', 'version type')
        .action(function (name, cmd) {
        // Start
        console.log();
        console.log(chalk_1.default.blue('[INFO] Creating migration...'));
        // Get config
        var config = files_1.getConfig();
        // Check migrations directory
        if (!config.migrationsDir || !fs_1.default.existsSync(config.migrationsDir)) {
            console.error(chalk_1.default.red("[FAIL] Migrations directory does not exist, Try " + chalk_1.default.yellow('wander init')));
            return console.log();
        }
        // Validate the name
        if (!validators_1.isValidMigrationName(name)) {
            console.error(chalk_1.default.red('[FAIL] Migration name can only contain a-Z, 0-9, and underscores'));
            return console.log();
        }
        // Prepare directory, version and filename
        var dir = config.migrationsDir;
        var version = versioning_1.getNextVersion(dir, cmd.versionType);
        var filename = "v" + version.fileSafe + constants_1.Delimiters.Separator + name + ".js";
        // Write the file
        fs_1.default.writeFileSync(path_1.default.join(dir, filename), migration_1.default(version, name));
        // Display message
        console.log(chalk_1.default.green("[DONE] Successfully created " + chalk_1.default.yellow(filename) + "!"));
        console.log();
    });
    commander_1.default
        .command('commit')
        .description('commit pending migrations')
        .option('-v, --verbose', 'show scripts committed')
        .option('-d, --dryrun', 'only display scripts but do not execute')
        .action(function (cmd) { return __awaiter(_this, void 0, void 0, function () {
        var history, currentVersion, committed, config, environment, databaseConfig, migrations, database, _i, migrations_1, migration, transaction, create, alter, drop, seed, truncate, execute, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Start
                    console.log();
                    console.log(chalk_1.default.blue('[INFO] Committing pending migrations...'));
                    history = files_1.getHistory();
                    currentVersion = '';
                    committed = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    config = files_1.getConfig();
                    environment = config.environments && config.environments[config.currentEnvironment] || null;
                    // Check if environment exists
                    if (!environment)
                        throw new Error("Current environment '" + config.currentEnvironment + "' cannot be found.");
                    databaseConfig = parsers_1.extractDatabaseConfig(environment.databaseURI);
                    migrations = files_1.getPendingMigrations(config.migrationsDir);
                    database = database_1.default.use(databaseConfig.protocol, databaseConfig);
                    // Update history
                    if (migrations.length > 0)
                        history.updatedAt = new Date().toISOString();
                    else {
                        // End
                        console.log(chalk_1.default.blue("[INFO] No pending migrations. Try " + chalk_1.default.yellow('wander new <name>') + " to create a new one."));
                        console.log();
                        process.exit();
                        return [2 /*return*/];
                    }
                    _i = 0, migrations_1 = migrations;
                    _a.label = 2;
                case 2:
                    if (!(_i < migrations_1.length)) return [3 /*break*/, 8];
                    migration = migrations_1[_i];
                    currentVersion = migration.version();
                    console.log(chalk_1.default.blue("[INFO] Committing migration " + chalk_1.default.yellow(migration.version()) + "..."));
                    transaction = new database.Transaction();
                    create = transaction.create, alter = transaction.alter, drop = transaction.drop, seed = transaction.seed, truncate = transaction.truncate, execute = transaction.execute;
                    // Prepare transaction
                    return [4 /*yield*/, migration.up({ create: create, alter: alter, drop: drop, seed: seed, truncate: truncate, execute: execute })];
                case 3:
                    // Prepare transaction
                    _a.sent();
                    transaction.commit();
                    // Show transaction
                    if (cmd.verbose || cmd.dryrun) {
                        console.log();
                        console.log(chalk_1.default.yellow(transaction.toString()));
                        console.log();
                    }
                    if (!!cmd.dryrun) return [3 /*break*/, 5];
                    // Run transaction
                    return [4 /*yield*/, database.query(transaction.toString())];
                case 4:
                    // Run transaction
                    _a.sent();
                    console.log(chalk_1.default.green("[DONE] Successfully committed migration " + chalk_1.default.yellow(migration.version()) + "."));
                    // Add migration to history
                    history.committed.push(migration.version());
                    return [3 /*break*/, 6];
                case 5:
                    console.log(chalk_1.default.green("[DONE] Successfully prepared migration " + chalk_1.default.yellow(migration.version()) + "."));
                    _a.label = 6;
                case 6:
                    // Increase committed
                    committed++;
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error(chalk_1.default.red(common_tags_1.stripIndents(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                    [FAIL] Could not commit '", "': ", "\n                    ", "\n                "], ["\n                    [FAIL] Could not commit '", "': ", "\n                    ", "\n                "])), chalk_1.default.yellow(currentVersion), error_1.message, error_1.stack)));
                    history.latestError = {
                        message: error_1.message,
                        failedAt: new Date().toISOString(),
                        migrationVersion: currentVersion
                    };
                    return [3 /*break*/, 10];
                case 10:
                    // Write the new history
                    files_1.writeToHistory(history);
                    // Padding
                    console.log();
                    console.log(chalk_1.default.blue("[INFO] Commited " + committed + " migration/s!"));
                    console.log();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    }); });
    commander_1.default
        .command('revert')
        .description('revert the most recent migration')
        .option('-c, --count [count]', 'number of migrations to revert')
        .option('-v, --verbose', 'show scripts committed')
        .option('-d, --dryrun', 'only display scripts but do not execute')
        .action(function (cmd) { return __awaiter(_this, void 0, void 0, function () {
        var history, currentVersion, config, environment, databaseConfig, migrations, database, _i, migrations_2, migration, transaction, create, alter, drop, seed, truncate, execute, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Start
                    console.log();
                    console.log(chalk_1.default.blue('[INFO] Reverting latest migration...'));
                    history = files_1.getHistory();
                    currentVersion = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    config = files_1.getConfig();
                    environment = config.environments && config.environments[config.currentEnvironment] || null;
                    // Check if environment exists
                    if (!environment)
                        throw new Error("Current environment '" + config.currentEnvironment + "' cannot be found.");
                    databaseConfig = parsers_1.extractDatabaseConfig(environment.databaseURI);
                    migrations = files_1.getLatestMigrations(config.migrationsDir, cmd.count || 1);
                    // Update history
                    if (migrations.length > 0)
                        history.updatedAt = new Date().toISOString();
                    else {
                        // End
                        console.log(chalk_1.default.blue("[INFO] No migrations have been committed yet. Try " + chalk_1.default.yellow('wander commit') + "."));
                        console.log();
                        process.exit();
                        return [2 /*return*/];
                    }
                    database = database_1.default.use(databaseConfig.protocol, databaseConfig);
                    _i = 0, migrations_2 = migrations;
                    _a.label = 2;
                case 2:
                    if (!(_i < migrations_2.length)) return [3 /*break*/, 7];
                    migration = migrations_2[_i];
                    currentVersion = migration.version();
                    console.log(chalk_1.default.blue("[INFO] Reverting migration " + chalk_1.default.yellow(migration.version()) + "..."));
                    transaction = new database.Transaction();
                    create = transaction.create, alter = transaction.alter, drop = transaction.drop, seed = transaction.seed, truncate = transaction.truncate, execute = transaction.execute;
                    // Prepare transaction
                    return [4 /*yield*/, migration.down({ create: create, alter: alter, drop: drop, seed: seed, truncate: truncate, execute: execute })];
                case 3:
                    // Prepare transaction
                    _a.sent();
                    transaction.commit();
                    // Show transaction
                    if (cmd.verbose || cmd.dryrun) {
                        console.log();
                        console.log(chalk_1.default.yellow(transaction.toString()));
                        console.log();
                    }
                    if (!!cmd.dryrun) return [3 /*break*/, 5];
                    // Run transaction
                    return [4 /*yield*/, database.query(transaction.toString())];
                case 4:
                    // Run transaction
                    _a.sent();
                    console.log(chalk_1.default.green("[DONE] Successfully reverted migration " + chalk_1.default.yellow(migration.version()) + "."));
                    // Remove migration from history
                    history.committed.pop();
                    return [3 /*break*/, 6];
                case 5:
                    console.log(chalk_1.default.green("[DONE] Successfully prepared migration " + chalk_1.default.yellow(migration.version()) + "."));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log();
                    console.log(chalk_1.default.blue("[INFO] Reverted " + migrations.length + " migration/s!"));
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _a.sent();
                    console.log();
                    console.error(chalk_1.default.red(common_tags_1.stripIndents(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                    [FAIL] Could not revert migrations: ", "\n                    ", "\n                "], ["\n                    [FAIL] Could not revert migrations: ", "\n                    ", "\n                "])), error_2.message, error_2.stack)));
                    history.latestError = {
                        message: error_2.message,
                        failedAt: new Date().toISOString(),
                        migrationVersion: currentVersion
                    };
                    return [3 /*break*/, 9];
                case 9:
                    // Write the new history
                    files_1.writeToHistory(history);
                    // Padding
                    console.log();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    }); });
    commander_1.default
        .command('reset')
        .description('reset the all migrations')
        .option('-v, --verbose', 'show scripts committed')
        .action(function (cmd) { return __awaiter(_this, void 0, void 0, function () {
        var history, currentVersion, config, environment, databaseConfig, migrations, database, _i, migrations_3, migration, transaction, create, alter, drop, seed, truncate, execute, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Start
                    console.log();
                    console.log(chalk_1.default.blue('[INFO] Resetting migrations...'));
                    history = files_1.getHistory();
                    currentVersion = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    config = files_1.getConfig();
                    environment = config.environments && config.environments[config.currentEnvironment] || null;
                    // Check if environment exists
                    if (!environment)
                        throw new Error("Current environment '" + config.currentEnvironment + "' cannot be found.");
                    databaseConfig = parsers_1.extractDatabaseConfig(environment.databaseURI);
                    migrations = files_1.getLatestMigrations(config.migrationsDir);
                    // Update history
                    if (migrations.length > 0)
                        history.updatedAt = new Date().toISOString();
                    else {
                        // End
                        console.log(chalk_1.default.blue("[INFO] No migrations have been committed yet. Try " + chalk_1.default.yellow('wander commit') + "."));
                        console.log();
                        process.exit();
                        return [2 /*return*/];
                    }
                    database = database_1.default.use(databaseConfig.protocol, databaseConfig);
                    _i = 0, migrations_3 = migrations;
                    _a.label = 2;
                case 2:
                    if (!(_i < migrations_3.length)) return [3 /*break*/, 6];
                    migration = migrations_3[_i];
                    currentVersion = migration.version();
                    console.log(chalk_1.default.blue("[INFO] Reverting migration " + chalk_1.default.yellow(migration.version()) + "..."));
                    transaction = new database.Transaction();
                    create = transaction.create, alter = transaction.alter, drop = transaction.drop, seed = transaction.seed, truncate = transaction.truncate, execute = transaction.execute;
                    // Prepare transaction
                    return [4 /*yield*/, migration.down({ create: create, alter: alter, drop: drop, seed: seed, truncate: truncate, execute: execute })];
                case 3:
                    // Prepare transaction
                    _a.sent();
                    transaction.commit();
                    // Show transaction
                    if (cmd.verbose) {
                        console.log();
                        console.log(chalk_1.default.yellow(transaction.toString()));
                        console.log();
                    }
                    // Run transaction
                    return [4 /*yield*/, database.query(transaction.toString())];
                case 4:
                    // Run transaction
                    _a.sent();
                    console.log(chalk_1.default.green("[DONE] Successfully reverted migration " + chalk_1.default.yellow(migration.version()) + "."));
                    // Remove migration from history
                    history.committed.pop();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    console.log();
                    console.log(chalk_1.default.blue("[INFO] Reverted " + migrations.length + " migration/s!"));
                    return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    console.log();
                    console.error(chalk_1.default.red(common_tags_1.stripIndents(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                    [FAIL] Could not revert migrations: ", "\n                    ", "\n                "], ["\n                    [FAIL] Could not revert migrations: ", "\n                    ", "\n                "])), error_3.message, error_3.stack)));
                    history.latestError = {
                        message: error_3.message,
                        failedAt: new Date().toISOString(),
                        migrationVersion: currentVersion
                    };
                    return [3 /*break*/, 8];
                case 8:
                    // Write the new history
                    files_1.writeToHistory(history);
                    // Padding
                    console.log();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    }); });
    commander_1.default.parse(process.argv);
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=index.js.map