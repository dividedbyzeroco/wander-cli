import path from 'path';
import fs from 'fs';
import cwd from 'cwd';
import glob from 'glob';
import { Filenames, Directories, Delimiters } from './constants';
import Versioning from './versioning';
import { extractVersion } from './parsers';
import { stripIndents } from 'common-tags';

export const getConfig = () => {
    const configPath = path.join(Directories.Root, Filenames.Config);
    if(fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
    }
    else return {
        migrationsDir: Directories.Migrations,
        environments: {},
        currentEnvironment: 'default'
    };
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
    if(fs.existsSync(historyPath)) {
        const config = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        return config;
    }
    else return { 
        committed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestError: null
    };
};

export const writeToHistory = history => {
    const historyPath = path.join(Directories.Root, Filenames.History);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 4));
};

export const getPendingMigrations = (dir: string) => {
    const migrations: any[] = [];
    const history = getHistory();
    const committedMigrations = history.committed;
    let filenames = glob.sync(path.join(dir,'/v*_*_*__*.js'));

    filenames = filenames.filter(filename => {
        return !committedMigrations.includes(extractVersion(dir, filename).standard);
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

    filenames = filenames.filter(filename => {
        return latestMigrations.includes(extractVersion(dir, filename).standard);
    });

    for(let filename of filenames) {
        const migration = require(cwd(filename));
        migrations.push(migration);
    }

    return migrations;
};