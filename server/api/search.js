/**
 * @module SearchRouter
 *
 * Module that handles search route
 */

const Router = require('express').Router();
const OracleDb = require('oracledb');
const ConnectionFactory = require('../database/connectionFactory');
const OperationsHelper = require('../database/operationsHelper');

let connectionPool = null;

/**
 * Handle search routes
 *
 * @param { IConnectionPool } _connectionPool
 * @return { Router }
 */
const SearchRouter = (_connectionPool) => {
    connectionPool = _connectionPool;

    Router
        .get('/', searchByName)
        .get('/all', getAll);

    return Router;
};

/**
 * Search movies and show by name
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const searchByName = async (req, res) => {
    if (!req.query.name ||
        !req.query.name.length) {
        return res.json({
            op: 'SEARCH',
            error: 'Query string must contain name attribute',
        });
    }

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            name: req.query.name,
            rs: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
        };
        const results = await oracleConnection.execute(`
            BEGIN :rs := SEARCH_BY_NAME(:name); END;
        `, bindVars);

        const resultSet = results.outBinds.rs;

        const dbEntities = await OperationsHelper.getObjectsFromResultSet(resultSet);

        await ConnectionFactory.closeResultSet(resultSet);
        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'SEARCH',
            name: req.query.name,
            data: dbEntities,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'SEARCH',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

/**
 * Search movies and show by limit.
 * Missing limit query parameter will default to a maximum of 5 records to be extracted.
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getAll = async (req, res) => {
    const limit = req.query.limit || 5;

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            rs: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
        };
        const results = await oracleConnection.execute(`
            BEGIN :rs := GET_ALL(); END;
        `, bindVars);

        const resultSet = results.outBinds.rs;

        const dbEntities = await OperationsHelper.getObjectsFromResultSet(resultSet, limit);

        await ConnectionFactory.closeResultSet(resultSet);
        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'GET-ALL',
            name: req.query.name,
            data: dbEntities,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'GET-ALL',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

module.exports = SearchRouter;
