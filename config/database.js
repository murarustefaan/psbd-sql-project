/**
 * Configuration module for the database connections.
 *
 * @class DbConfig
 * @property { function } getDbUser
 * @property { function } getDbPassword
 */
const DbConfig = {
    /**
     * Get the Oracle connection username from a environment variable.
     *
     * @return { ?string } The username, if found. Otherwise null.
     */
    getDbUser: () => process.env.PSBD_ORA_USER || null,

    /**
     * Get tge Oracle connection password from a environment variable.
     *
     * @return { ?string } The password, if found. Otherwise null.
     */
    getDbPassword: () => process.env.PSBD_ORA_PASS || null,

    /**
     * Get the Oracle connection string from an environment variable.
     * The connection string should look like:
     * host_name[:port][/service_name]
     *
     * @return { ?string } The connection string, if found. Otherwise null.
     */
    getDbConnectionString: () => process.env.PSBD_ORA_CONN_STRING || null,

    /**
     * Create a Oracle connection configuration object
     *
     * @param { string } connectionString   The connection string to the database
     * @param { string } [username]         The username for the db connection
     * @param { string } [password]         The password required for the db connection
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
     * @return { boolean }                      True or false,
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
 * @typedef ConnectionConfig            Oracle database connection configuration object type
 * @type { object }
 *
 * @property { string } connectString   The connection string for the database
 * @property { string } [user]          The username for the database connection
 * @property { string } [password]      The password string for the database connection
 */

module.exports = DbConfig;
