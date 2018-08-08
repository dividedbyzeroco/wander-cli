import { DatabaseConfigType } from '../../../types/database';
export default class DatabaseClient {
    /**
     * Private propreties
     */
    _config: DatabaseConfigType;
    /**
     * Constructor
     * @param {Object} config
     */
    constructor({ host, port, user, password, schema, timeout, charset }: DatabaseConfigType);
    static escape(value: any): string;
    static escapeKey(value: string): string;
    query(queryString: string): Promise<any>;
}
