const Oracle = require('oracledb');
const DbConfig = require('./config/database');

const oracleConnectParams = DbConfig.createConnectionConfig(
    DbConfig.getDbConnectionString(),
    DbConfig.getDbUser(),
    DbConfig.getDbPassword()
);

if (!DbConfig.validateConnectionConfig(oracleConnectParams)) {
    process.exit(1);
}

console.info(`Database connection string: ${oracleConnectParams.connectString}`);
console.info(`Database connection username: ${oracleConnectParams.user}`);
console.info(`Database connection password: ${oracleConnectParams.password}`);
