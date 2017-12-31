const DbConfig = require('./config/database');
const ConnectionFactory = require('./database/connectionFactory');

const Express = require('express');
const ExpressRouter = Express.Router();

const oracleConnectParams = DbConfig.createConnectionConfig(
    DbConfig.getDbConnectionString(),
    DbConfig.getDbUser(),
    DbConfig.getDbPassword()
);

if (!DbConfig.validateConnectionConfig(oracleConnectParams)) {
    console.error('Invalid oracle configuration');
    process.exit(1);
}

console.info(`Database connection string: ${oracleConnectParams.connectString}`);
console.info(`Database connection username: ${oracleConnectParams.user}`);
console.info(`Database connection password: ${oracleConnectParams.password}`);

console.info('Creating Oracle connection pool...');
ConnectionFactory.createConnectionPool(oracleConnectParams)
    .then(
        async (connectionPool) => {
            console.info('Oracle connection pool created successfully.');

            const connection = await ConnectionFactory.getConnection(connectionPool);
            const data = await connection.execute(`SELECT * FROM TEST`);

            console.log(data.rows);

            await ConnectionFactory.closeConnection(connection);
            await ConnectionFactory.closeConnectionPool(connectionPool);
        },
        (error) => {
            console.error(error);
        }
    );
