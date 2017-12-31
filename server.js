const DbConfig = require('./config/database');
const ConnectionFactory = require('./database/connectionFactory');

const Express = require('express');
const server = Express();

const BodyParser = require('body-parser');

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

            // Initialize Body-Parser
            server.use(BodyParser.json());
            server.use(BodyParser.urlencoded({extended: false}));

            // Initialize api routes
            server.use('/api/movie', require('./api/movie')(connectionPool));

            server.listen(process.env.PSBD_SERVER_PORT, () => {
                console.log(`Server started...`);
            });
        },
        (error) => {
            console.error(error);
        }
    );
