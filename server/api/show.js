/**
 * @module ShowRouter
 *
 * Module that handles show routes
 */

const Router = require('express').Router();
const OracleDb = require('oracledb');
const ConnectionFactory = require('../database/connectionFactory');
const Show = require('../models/show');
const OperationsHelper = require('../database/operationsHelper');

let connectionPool = null;

/**
 * Handle show routes
 *
 * @param { IConnectionPool } _connectionPool
 * @return { Router }
 */
const ShowRouter = (_connectionPool) => {
    connectionPool = _connectionPool;

    Router
        .get('/:base_id', getShowDetails)
        .get('/:base_id/runtime', getShowRuntime);

    return Router;
};

/**
 * Get show details
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getShowDetails = async (req, res) => {
    if (isNaN(Number(req.params.base_id))) {
        return res.json({
            op: 'GET-DETAILS',
            error: 'The base_id parameter must only contain numeric characters',
        });
    }

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            base_id: req.params.base_id,
            rs: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
        };
        const results = await oracleConnection.execute(`
            BEGIN :rs := GET_SHOW_DETAILS(:base_id); END;
        `, bindVars);

        const resultSet = results.outBinds.rs;
        const _dbShows = await OperationsHelper.getObjectsFromResultSet(resultSet);
        const shows = [];
        for (const _dbShow of _dbShows) {
            const show = new Show(
                _dbShow.baseId,
                _dbShow.imdbLink,
                _dbShow.name,
                _dbShow.description,
                _dbShow.imageUrl,
                _dbShow.episodeRuntime
            );

            const seasonQueryResults = await oracleConnection.execute(`
                BEGIN :rs := GET_SEASONS_FOR_SHOW(:showId); END;
            `, {
                rs: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
                showId: _dbShow.showId,
            });
            const seasonsResultSet = seasonQueryResults.outBinds.rs;

            const seasons = await OperationsHelper.getObjectsFromResultSet(seasonsResultSet);
            show.seasons = seasons;

            shows.push(show);
            ConnectionFactory.closeResultSet(seasonsResultSet);
        }


        await ConnectionFactory.closeResultSet(resultSet);
        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'GET-DETAILS',
            id: req.params.base_id,
            data: shows,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'GET-DETAILS',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

/**
 * Get show runtime
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getShowRuntime = async (req, res) => {
    if (isNaN(Number(req.params.base_id))) {
        return res.json({
            op: 'GET-RUNTIME',
            error: 'The base_id parameter must only contain numeric characters',
        });
    }

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            base_id: req.params.base_id,
            runtime: {dir: OracleDb.BIND_OUT, type: OracleDb.NUMBER},
        };
        const result = await oracleConnection.execute(`
            BEGIN :runtime := GET_SHOW_RUNTIME(:base_id); END;
        `, bindVars);

        const runtime = result.outBinds.runtime;

        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'GET-RUNTIME',
            id: req.params.base_id,
            runtime,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'GET-RUNTIME',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

module.exports = ShowRouter;
