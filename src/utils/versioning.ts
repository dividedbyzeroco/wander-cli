import fs from 'fs';
import { Delimiters } from './constants';

export default class Versioning {
    
    major: number;
    minor: number;
    patch: number;

    constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    get fileSafe() {
        return [this.major, this.minor, this.patch].join(Delimiters.FileSafe);
    }

    get standard() {
        return [this.major, this.minor, this.patch].join(Delimiters.Standard);
    }
}

const getVersionString = (str: string) => {
    return str.split(Delimiters.Separator)[0].slice(1);
};

const getVersionParts = (str: string) => {
    return str.split(Delimiters.FileSafe).map(part => parseInt(part));
};

export const getNextVersion = (dir: string, versionType: string) => {
    // Get latest version
    const versions = fs.readdirSync(dir);
    const latestVersion = versions.length === 0 ? 
        `v1${Delimiters.FileSafe}0${Delimiters.FileSafe}-1${Delimiters.Separator}` : 
        versions.sort((vPrev, vCurr) => vPrev > vCurr? -1 : 1)[0];

    // Get version parts
    const [ major, minor, patch ] = getVersionParts(getVersionString(latestVersion));
    
    // Return next version
    switch(versionType) {
        case 'major': return new Versioning(major + 1, 0, 0);
        case 'minor': return new Versioning(major, minor + 1, 0);
        case 'patch':
        default: return new Versioning(major, minor, patch + 1);
    }
};