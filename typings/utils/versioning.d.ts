export default class Versioning {
    major: number;
    minor: number;
    patch: number;
    constructor(major: number, minor: number, patch: number);
    readonly fileSafe: string;
    readonly standard: string;
}
export declare const getVersionString: (str: string) => string;
export declare const getVersionParts: (str: string) => number[];
export declare const parseVersionParts: (str: string) => number[];
export declare const compareVersions: (vPrev: any, vCurr: any) => 1 | -1;
export declare const getNextVersion: (dir: string, versionType: string) => Versioning;
