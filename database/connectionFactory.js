/**
 * @module ConnectionFactory
 *
 * Module used for handling Oracle Connections
 */

const Oracle = require('oracledb');

const ConnectionFactory = {
    /**
     * Create a Oracle connection pool based on given settings
     *
     * @param { ConnectionConfig } connectionConfig
     * @return { IConnectionPool | Error }
     * @async
     */
    createConnectionPool: async (connectionConfig) => {
        try {
            const connectionPool = await Oracle.createPool(connectionConfig);
            return connectionPool;
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    /**
     * Get a connection from a connection pool
     *
     * @param { IConnectionPool } connectionPool
     * @return { IConnection }
     * @async
     */
    getConnection: async (connectionPool) => {
        try {
            const connection = await connectionPool.getConnection();
            return connection;
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    /**
     * Close a open Oracle connection
     *
     * @param { IConnection } connection
     * @return { Boolean }
     */
    closeConnection: async (connection) => {
        try {
            await connection.close();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    /**
     * Close a existing connection pool
     *
     * @param { IConnectionPool } connectionPool
     * @return { Boolean }
     */
    closeConnectionPool: async (connectionPool) => {
        try {
            await connectionPool.close();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
};

/**
 * @typedef { Object } ConnectionConfig            Oracle database connection configuration object type
 * @property { String } connectString   The connection string for the database
 * @property { String= } user           The username for the database connection
 * @property { String= } password       The password string for the database connection
 */

module.exports = ConnectionFactory;
