import path from 'path';
import fs from 'fs';
import cwd from 'cwd';
import glob from 'glob';
import { Filenames, Directories, Environments } from './constants';
import { extractVersion } from './parsers';
import { stripIndents } from 'common-tags';
import { compareVersions, parseVersionParts } from './versioning';

export const getConfig = () => {
    const configPath = path.join(Directories.Root, Filenames.Config);
    const defaultConfig = {
        migrationsDir: Directories.Migrations,
        environments: {},
        currentEnvironment: Environments.Default
    };
    if(fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
    }
    else return defaultConfig;
};

export const writeToConfig = config => {
    const configPath = path.join(Directories.Root, Filenames.Config);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

export const writeToGitIgnore = () => {
    const gitIgnorePath = path.join(Directories.Root, Filenames.GitIgnore);
    fs.writeFileSync(gitIgnorePath, stripIndents`
        wrconfig.json
        wrhistory.json
    `);
};

export const getHistory = () => {
    const historyPath = path.join(Directories.Root, Filenames.History);
    const config = getConfig();
    const defaultHistory = { 
        committed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestError: null
    };

    if(fs.existsSync(historyPath)) {
        const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        const environmentHistory = history[config.currentEnvironment];
        if(typeof environmentHistory === 'undefined') {
            return defaultHistory;
        }
        else return environmentHistory;
    }
    else return defaultHistory;
};

export const writeToHistory = environmentHistory => {
    const historyPath = path.join(Directories.Root, Filenames.History);
    const config = getConfig();
    let history = {};
    if(fs.existsSync(historyPath)) {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    history[config.currentEnvironment] = environmentHistory;
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 4));
};

export const getPendingMigrations = (dir: string) => {
    const migrations: any[] = [];
    const history = getHistory();
    const committedMigrations = history.committed;
    let filenames = glob.sync(path.join(dir,'/v*_*_*__*.js'));

    filenames = filenames.filter(filename => !committedMigrations.includes(extractVersion(dir, filename).standard))
    .sort((prev, curr) => {
        const vPrev = prev.split('/')[1];
        const vCurr = curr.split('/')[1];
        return compareVersions(parseVersionParts(vCurr), parseVersionParts(vPrev));
    });

    for(let filename of filenames) {
        const migration = require(cwd(filename));
        migrations.push(migration);
    }

    return migrations;
};

export const getLatestMigrations = (dir: string, count?: number) => {
    const migrations: any[] = [];
    const history = getHistory();
    const migrationCount = count || history.committed.length;
    const latestMigrations = history.committed.slice().reverse().slice(0, migrationCount);
    let filenames = glob.sync(path.join(dir,'/v*_*_*__*.js'));

    filenames = filenames.filter(filename => !latestMigrations.includes(extractVersion(dir, filename).standard))
    .sort((prev, curr) => {
        const vPrev = prev.split('/')[1];
        const vCurr = curr.split('/')[1];
        return compareVersions(parseVersionParts(vCurr), parseVersionParts(vPrev));
    })
    .slice()
    .reverse()
    .slice();

    for(let filename of filenames) {
        const migration = require(cwd(filename));
        migrations.push(migration);
    }

    return migrations;
};