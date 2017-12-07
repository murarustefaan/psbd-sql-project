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
     * @return { string } The username, if found. Otherwise null.
     */
    getDbUser: () => process.env.PSBD_ORA_USER || null,

    /**
     * Get tge Oracle connection password from a environment variable.
     *
     * @return { string } The password, if found. Otherwise null.
     */
    getDbPassword: () => process.env.PSBD_ORA_PASS || null,
};

module.exports = DbConfig;
