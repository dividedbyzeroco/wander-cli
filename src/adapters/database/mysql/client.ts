import mysql from 'mysql';
import { DatabaseConfigType } from '../../../types/database';

export default class DatabaseClient {

    /**
     * Private propreties
     */
    _config: DatabaseConfigType = {
        host: 'localhost',
        user: '',
        password: ''
    };

    /**
     * Constructor
     * @param {Object} config 
     */
    constructor({ 
        host, 
        port, 
        user, 
        password, 
        schema, 
        timeout, 
        charset
    }: DatabaseConfigType) {
        // Prepare parameters
        this._config.host = host;
        this._config.port = port;
        this._config.user = user;
        this._config.password = password;
        this._config.schema = schema;
        this._config.charset = charset;
        this._config.timeout = timeout;
    }

    static escape(value: any) {
        return mysql.escape(value);
    }

    static escapeKey(value: string) {
        return mysql.escapeId(value);
    }

    async query(queryString: string): Promise<any> {

        // Prepare pool
        const connection = mysql.createConnection({
            host: this._config.host,
            port: this._config.port,
            user: decodeURIComponent(this._config.user),
            password: decodeURIComponent(this._config.password),
            database: this._config.schema,
            timeout: this._config.timeout,
            charset: this._config.charset,
            multipleStatements: true
        });

        // Connect to the database
        connection.connect();

        // Run query
        return await new Promise((resolve, reject) => {
            connection.query(queryString, (error, result) => {
                if(!error) {
                    // Destroy the connection
                    connection.destroy();
                    resolve(result);
                }
                else reject(new Error(`Invalid query request: ${error}`));
            });
        });
    }
}