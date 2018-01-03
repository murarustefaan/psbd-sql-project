/**
 * @module DbConfig
 *
 * Configuration module for the database connections.
 */
const DbConfig = {
    /**
     * Get the Oracle connection username from a environment variable.
     *
     * @return { ?String } The username, if found. Otherwise null.
     */
    getDbUser: () => process.env.PSBD_ORA_USER || null,

    /**
     * Get the Oracle connection password from a environment variable.
     *
     * @return { ?String } The password, if found. Otherwise null.
     */
    getDbPassword: () => process.env.PSBD_ORA_PASS || null,

    /**
     * Get the Oracle connection string from an environment variable.
     * The connection string should look like:
     * host_name[:port][/service_name]
     *
     * @return { ?String } The connection string, if found. Otherwise null.
     */
    getDbConnectionString: () => process.env.PSBD_ORA_CONN_STRING || null,

    /**
     * Create a Oracle connection configuration object
     *
     * @param { String } connectionString   The connection string to the database
     * @param { String= } username          The username for the db connection
     * @param { String= } password          The password required for the db connection
     * @return { ConnectionConfig }         The database connection configuration object
     */
    createConnectionConfig: (connectionString, username, password) => ({
        connectString: connectionString,
        user: username ? username : undefined,
        password: password ? password : undefined,
    }),

    /**
     * Validate a connection configuration object
     *
     * @param { ConnectionConfig } configObject The connection configuration object
     * @return { Boolean }                      True or false,
     * whether the configuration object is valid or not
     */
    validateConnectionConfig: (configObject) => {
        if (!configObject.connectString) {
            return false;
        }

        if (configObject.user &&
            !configObject.password) {
            return false;
        }

        return true;
    },
};

/**
 * @typedef { Object } ConnectionConfig            Oracle database connection configuration object type
 * @property { String } connectString   The connection string for the database
 * @property { String= } user           The username for the database connection
 * @property { String= } password       The password string for the database connection
 */

module.exports = DbConfig;
