/**
 * @module MovieRouter
 *
 * Module that handles movies routes
 */

const Router = require('express').Router();
const OracleDb = require('oracledb');
const ToCamelcase = require('camelcase');
const ConnectionFactory = require('../database/connectionFactory');
const Movie = require('../models/movie');
const BaseTypes = require('../models/base').BaseTypes;

let connectionPool = null;

/**
 * Handle movie routes
 *
 * @param { IConnectionPool } _connectionPool
 * @return { Router }
 */
const MovieRouter = (_connectionPool) => {
    connectionPool = _connectionPool;

    Router
        .get('/:base_id', getMovieDetails)
        .get('/:base_id/runtime', getMovieRuntime)
        .post('/', createOrUpdateMovie)
        .delete('/:base_id', deleteMovie);

    return Router;
};

/**
 * Get movie details
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getMovieDetails = async (req, res) => {
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
            cursor: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
        };
        const resultSet = await oracleConnection.execute(`
            BEGIN :cursor := GET_MOVIE_DETAILS(:base_id); END;
        `, bindVars);

        const cursor = resultSet.outBinds.cursor;
        const _dbMovies = await getCursorObjects(cursor);
        const movies = [];
        for (const _dbMovie of _dbMovies) {
            movies.push(new Movie(
                _dbMovie.baseId,
                _dbMovie.imdbLink,
                _dbMovie.name,
                _dbMovie.length,
                _dbMovie.releaseDate,
                _dbMovie.imageUrl,
                _dbMovie.description
            ));
        }

        await resultSet.outBinds.cursor.close();
        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'GET-DETAILS',
            id: req.params.base_id,
            data: movies,
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
 * Get movie runtime
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getMovieRuntime = async (req, res) => {
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
            BEGIN :runtime := GET_MOVIE_RUNTIME(:base_id); END;
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

/**
 * Create a new movie if it does not already exist or
 * update a existing one otherwise.
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const createOrUpdateMovie = (req, res) => {
    return res.json({
        name: req.body.name,
        op: 'CREATE-OR-UPDATE',
    });
};

/**
 * Delete a existing movie
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const deleteMovie = (req, res) => {
    return res.json({
        id: req.params.base_id,
        op: 'DELETE',
    });
};

/**
 * Retrieve data from an open cursor
 *
 * @param { IResultSet } cursor
 * @return { Array<Object> } The data retrieved from the specific cursor
 */
const getCursorObjects = async (cursor) => {
    const keys = cursor.metaData;
    const objects = [];
    let obj = null;

    do {
        obj = (await cursor.getRow()) || null;
        if (obj !== null) {
            const normalizedObject = {};

            // Due to how OracleDB driver gets values from the database, we need to
            // create an object from 2 arrays, one containing keys, the other one values.
            obj.forEach((prop, index) => {
                const keyName = keys[index].name;
                const key = ToCamelcase(keyName);

                normalizedObject[key] = prop;
            });

            objects.push(normalizedObject);
        }
    } while (obj !== null);

    return objects;
};

module.exports = MovieRouter;
