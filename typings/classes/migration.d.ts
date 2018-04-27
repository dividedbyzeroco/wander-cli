import { IMigration, MigrationOptions } from '../types/migration';
export default class Migration implements IMigration {
    readonly version: string;
    readonly description: string;
    up(options?: MigrationOptions): Promise<any>;
    down(options?: MigrationOptions): Promise<any>;
}
