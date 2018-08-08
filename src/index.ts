import fs from 'fs';
import path from 'path';
import program from 'commander';
import chalk from 'chalk';
import promptly from 'promptly';
import rimraf from 'rimraf';
import { stripIndents } from 'common-tags';
import migrationTemplate from './templates/migration';
import { Directories, Delimiters, Environments } from './utils/constants';
import { getNextVersion } from './utils/versioning';
import { getConfig, getPendingMigrations, getHistory, writeToHistory, writeToConfig, writeToGitIgnore, getLatestMigrations } from './utils/files';
import { isValidMigrationName } from './utils/validators';
import Database from './adapters/database';
import { extractDatabaseConfig } from './utils/parsers';

export default () => {
    // Initialize the program
    program
        .version(require('../package.json').version)
        .description(chalk.yellow('Database Migrations for Modern Apps'));

    // Initialize wander
    program
        .command('init')
        .description('initialize directory')
        .action(async () => {
            // Start
            console.log();
            console.log(chalk.blue(`[INFO] Initializing ${chalk.yellow('wander')}...`));

            // Get directory
            const dir = await promptly.prompt(
                chalk.blue(`[INFO] Enter a path for your migrations directory [${Directories.Migrations}]: `), 
                { retry: false, default: Directories.Migrations });
            
            // Prepare directory
            if(fs.existsSync(dir)) {
                const confirmOverride = await promptly.confirm(
                    chalk.yellow(`[WARN] Directory '${dir}' already exists! Do you want to override it?`), 
                    { retry: false });

                if(confirmOverride) {
                    rimraf.sync(dir);
                    fs.mkdirSync(dir);
                }
            }
            else fs.mkdirSync(dir);

            // Get database uri
            const uri = await promptly.prompt(
                chalk.blue('[INFO] Enter your database URI: '),
                { retry: false });

            // Prepare config
            const config = getConfig();
            config.migrationsDir = dir;
            config.environments[Environments.Default] = {
                databaseURI: uri
            };
            config.currentEnvironment = Environments.Default;

            // Write config
            writeToConfig(config);

            // Write gitignore
            writeToGitIgnore();

            // Finish initializing
            console.log();
            console.log(chalk.green(`[DONE] Successfully initialized ${chalk.yellow('wander')}!`))
            console.log();
        });

    // Initialize wander
    program
        .command('env')
        .description('change environment')
        .action(async () => {
            // Start
            console.log();
            console.log(chalk.blue(`[INFO] Changing ${chalk.yellow('wander')} environment...`));

            // Get config
            const config = getConfig();

            // Get env
            const env = await promptly.prompt(
                chalk.blue(`[INFO] Enter the name of the environment you want to switch to [${config.currentEnvironment}]: `), 
                { retry: false, default: config.currentEnvironment });
            
            if(typeof config.environments[env] === 'undefined') {
                // Get database uri
                const uri = await promptly.prompt(
                    chalk.blue('[INFO] Environment is not yet defined. Enter its database URI: '),
                    { retry: false });

                // Create the new environment
                config.environments[env] = {
                    databaseURI: uri
                };
            }

            // Prepare config
            config.currentEnvironment = env;

            // Write config
            writeToConfig(config);

            // Finish changing environments
            console.log();
            console.log(chalk.green(`[DONE] Successfully changed ${chalk.yellow('wander')} environment!`))
            console.log();
        });


    // Creating a new migration
    program
        .command('new <name>')
        .description('create a new migration')
        .option('-t, --version-type [type]', 'version type')
        .action((name, cmd) => {
            // Start
            console.log();
            console.log(chalk.blue('[INFO] Creating migration...'));

            // Get config
            const config = getConfig();

            // Check migrations directory
            if(!config.migrationsDir || !fs.existsSync(config.migrationsDir)) {
                console.error(chalk.red(`[FAIL] Migrations directory does not exist, Try ${chalk.yellow('wander init')}`));
                return console.log();
            }

            // Validate the name
            if(!isValidMigrationName(name)) {
                console.error(chalk.red('[FAIL] Migration name can only contain a-Z, 0-9, and underscores'));
                return console.log();
            }

            // Prepare directory, version and filename
            const dir = config.migrationsDir;
            const version = getNextVersion(dir, cmd.versionType);
            const filename = `v${version.fileSafe}${Delimiters.Separator}${name}.js`;

            // Write the file
            fs.writeFileSync(path.join(dir, filename), migrationTemplate(version, name));
            
            // Display message
            console.log(chalk.green(`[DONE] Successfully created ${chalk.yellow(filename)}!`));
            console.log();
        });

    program
        .command('commit')
        .description('commit pending migrations')
        .option('-v, --verbose', 'show scripts committed')
        .action(async (cmd) => {
            // Start
            console.log();
            console.log(chalk.blue('[INFO] Committing pending migrations...'));

            // Get migration history
            const history = getHistory();

            // Prepare current version placeholder and committed count
            let currentVersion = '';
            let committed = 0;

            try {
                // Get config
                const config = getConfig();
                const environment = config.environments && config.environments[config.currentEnvironment] || null;

                // Check if environment exists
                if(!environment) throw new Error(`Current environment '${config.currentEnvironment}' cannot be found.`);

                // Prepare database config
                const databaseConfig = extractDatabaseConfig(environment.databaseURI);

                // Get migrations
                const migrations = getPendingMigrations(config.migrationsDir);

                // Connect to the database
                const database = Database.use(databaseConfig.protocol, databaseConfig);

                // Update history
                if(migrations.length > 0)
                    history.updatedAt = new Date().toISOString();
                else {
                    // End
                    console.log(chalk.blue(`[INFO] No pending migrations. Try ${chalk.yellow('wander new <name>')} to create a new one.`));
                    console.log();
                    process.exit();
                    return;
                }

                // Run migration commits
                for(let migration of migrations) {
                    currentVersion = migration.version();
                    console.log(chalk.blue(`[INFO] Committing migration ${chalk.yellow(migration.version())}...`));

                    // Prepare transaction
                    const transaction = new database.Transaction();
                    const { create, alter, drop, seed, truncate, execute } = transaction;

                    // Prepare transaction
                    await migration.up({ create, alter, drop, seed, truncate, execute });
                    transaction.commit();

                    // Show transaction
                    if(cmd.verbose) {
                        console.log();
                        console.log(chalk.yellow(transaction.toString()));
                        console.log();
                    }

                    // Run transaction
                    await database.query(transaction.toString());

                    console.log(chalk.green(`[DONE] Successfully committed migration ${chalk.yellow(migration.version())}.`));

                    // Add migration to history
                    history.committed.push(migration.version());

                    // Increase committed
                    committed++;
                }
            }
            catch(error) {
                console.error(chalk.red(stripIndents`
                    [FAIL] Could not commit '${chalk.yellow(currentVersion)}': ${error.message}
                    ${error.stack}
                `));
                history.latestError = {
                    message: error.message,
                    failedAt: new Date().toISOString(),
                    migrationVersion: currentVersion
                };
            }

            // Write the new history
            writeToHistory(history);

            // Padding
            console.log();
            console.log(chalk.blue(`[INFO] Commited ${committed} migration/s!`));
            console.log();
            process.exit();
        });

    program
        .command('revert')
        .description('revert the most recent migration')
        .option('-c, --count [count]', 'number of migrations to revert')
        .option('-v, --verbose', 'show scripts committed')
        .action(async (cmd) => {
            // Start
            console.log();
            console.log(chalk.blue('[INFO] Reverting latest migration...'));

            // Get migration history
            const history = getHistory();

            // Prepare current version placeholder
            let currentVersion = '';

            try {
                // Get config
                const config = getConfig();
                const environment = config.environments && config.environments[config.currentEnvironment] || null;

                // Check if environment exists
                if(!environment) throw new Error(`Current environment '${config.currentEnvironment}' cannot be found.`);

                // Prepare database config
                const databaseConfig = extractDatabaseConfig(environment.databaseURI);

                // Get migrations
                const migrations = getLatestMigrations(config.migrationsDir, cmd.count || 1);

                // Update history
                if(migrations.length > 0)
                    history.updatedAt = new Date().toISOString();
                else {
                    // End
                    console.log(chalk.blue(`[INFO] No migrations have been committed yet. Try ${chalk.yellow('wander commit')}.`));
                    console.log();
                    process.exit();
                    return;
                }

                // Connect to the database
                const database = Database.use(databaseConfig.protocol, databaseConfig);

                // Run migration commits
                for(let migration of migrations) {
                    currentVersion = migration.version();
                    console.log(chalk.blue(`[INFO] Reverting migration ${chalk.yellow(migration.version())}...`));

                    // Prepare transaction
                    const transaction = new database.Transaction();
                    const { create, alter, drop, seed, truncate, execute } = transaction;

                    // Prepare transaction
                    await migration.down({ create, alter, drop, seed, truncate, execute });
                    transaction.commit();

                    // Show transaction
                    if(cmd.verbose) {
                        console.log();
                        console.log(chalk.yellow(transaction.toString()));
                        console.log();
                    }

                    // Run transaction
                    await database.query(transaction.toString());

                    console.log(chalk.green(`[DONE] Successfully reverted migration ${chalk.yellow(migration.version())}.`));

                    // Remove migration from history
                    history.committed.pop();
                }

                console.log();
                console.log(chalk.blue(`[INFO] Reverted ${migrations.length} migration/s!`));
            }
            catch(error) {
                console.log();
                console.error(chalk.red(stripIndents`
                    [FAIL] Could not revert migrations: ${error.message}
                    ${error.stack}
                `));
                history.latestError = {
                    message: error.message,
                    failedAt: new Date().toISOString(),
                    migrationVersion: currentVersion
                };
            }

            // Write the new history
            writeToHistory(history);

            // Padding
            console.log();
            process.exit();
        });

    program
        .command('reset')
        .description('reset the all migrations')
        .option('-v, --verbose', 'show scripts committed')
        .action(async (cmd) => {
            // Start
            console.log();
            console.log(chalk.blue('[INFO] Resetting migrations...'));

            // Get migration history
            const history = getHistory();

            // Prepare current version placeholder
            let currentVersion = '';

            try {
                // Get config
                const config = getConfig();
                const environment = config.environments && config.environments[config.currentEnvironment] || null;

                // Check if environment exists
                if(!environment) throw new Error(`Current environment '${config.currentEnvironment}' cannot be found.`);

                // Prepare database config
                const databaseConfig = extractDatabaseConfig(environment.databaseURI);

                // Get migrations
                const migrations = getLatestMigrations(config.migrationsDir);

                // Update history
                if(migrations.length > 0)
                    history.updatedAt = new Date().toISOString();
                else {
                    // End
                    console.log(chalk.blue(`[INFO] No migrations have been committed yet. Try ${chalk.yellow('wander commit')}.`));
                    console.log();
                    process.exit();
                    return;
                }

                // Connect to the database
                const database = Database.use(databaseConfig.protocol, databaseConfig);

                // Run migration commits
                for(let migration of migrations) {
                    currentVersion = migration.version();
                    console.log(chalk.blue(`[INFO] Reverting migration ${chalk.yellow(migration.version())}...`));

                    // Prepare transaction
                    const transaction = new database.Transaction();
                    const { create, alter, drop, seed, truncate, execute } = transaction;

                    // Prepare transaction
                    await migration.down({ create, alter, drop, seed, truncate, execute });
                    transaction.commit();

                    // Show transaction
                    if(cmd.verbose) {
                        console.log();
                        console.log(chalk.yellow(transaction.toString()));
                        console.log();
                    }

                    // Run transaction
                    await database.query(transaction.toString());

                    console.log(chalk.green(`[DONE] Successfully reverted migration ${chalk.yellow(migration.version())}.`));

                    // Remove migration from history
                    history.committed.pop();
                }

                console.log();
                console.log(chalk.blue(`[INFO] Reverted ${migrations.length} migration/s!`));
            }
            catch(error) {
                console.log();
                console.error(chalk.red(stripIndents`
                    [FAIL] Could not revert migrations: ${error.message}
                    ${error.stack}
                `));
                history.latestError = {
                    message: error.message,
                    failedAt: new Date().toISOString(),
                    migrationVersion: currentVersion
                };
            }

            // Write the new history
            writeToHistory(history);

            // Padding
            console.log();
            process.exit();
        });
        
    program.parse(process.argv);
};