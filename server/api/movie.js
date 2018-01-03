/**
 * @module MovieRouter
 *
 * Module that handles movies routes
 */

const Router = require('express').Router();
const OracleDb = require('oracledb');
const ConnectionFactory = require('../database/connectionFactory');
const Movie = require('../models/movie');
const OperationsHelper = require('../database/operationsHelper');

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
            rs: {dir: OracleDb.BIND_OUT, type: OracleDb.CURSOR},
        };
        const results = await oracleConnection.execute(`
            BEGIN :rs := GET_MOVIE_DETAILS(:base_id); END;
        `, bindVars);

        const resultSet = results.outBinds.rs;
        const _dbMovies = await OperationsHelper.getObjectsFromResultSet(resultSet);
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

        await ConnectionFactory.closeResultSet(resultSet);
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
const createOrUpdateMovie = async (req, res) => {
    if (isPostInvalidBody(req.body)) {
        return res.json({
            op: 'CREATE-OR-UDPATE',
            error: 'Invalid body parameters',
        });
    }

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            base_id: req.body.baseId,
            imdb_link: req.body.imdbLink,
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.imageUrl,
            length: req.body.length,
            release_date: new Date(req.body.releaseDate),
            new_id: {dir: OracleDb.BIND_OUT, type: OracleDb.NUMBER},
        };
        const result = await oracleConnection.execute(`
            BEGIN
                CREATE_OR_UPDATE_MOVIE(
                    :base_id, :imdb_link, :name, :description, :image_url, :length, :release_date, :new_id
                );
                COMMIT;
            END;
        `, bindVars);

        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'CREATE-OR-UPDATE',
            id: result.outBinds.new_id || undefined,
            data: req.body,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'CREATE-OR-UPDATE',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

/**
 * Test if request body is valid or not for a CREATE-OR-UPDATE-MOVIE action.
 *
 * @param { Object }            reqBody
 * @param { String | Number }   reqBody.baseId
 * @param { String }            reqBody.imdbLink
 * @param { String }            reqBody.name
 * @param { String }            reqBody.description
 * @param { String }            reqBody.imageUrl
 * @param { String | Number }   reqBody.length
 * @param { String | Date }     reqBody.releaseDate
 * @return { Boolean }
 */
const isPostInvalidBody = (reqBody) => {
    return !reqBody.imdbLink ||
        !reqBody.name ||
        !reqBody.description ||
        !reqBody.imageUrl ||
        !reqBody.length ||
        !reqBody.releaseDate;
};

/**
 * Delete a existing movie
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const deleteMovie = async (req, res) => {
    if (!req.params.base_id ||
        isNaN(Number(req.params.base_id))) {
        return res.json({
            op: 'DELETE',
            error: 'The base_id parameter must only contain numeric characters',
        });
    }

    let responseBody = null;
    try {
        const oracleConnection = await connectionPool.getConnection();

        const bindVars = {
            base_id: req.params.base_id,
            ret_id: {dir: OracleDb.BIND_OUT, type: OracleDb.NUMBER},
        };
        const result = await oracleConnection.execute(`
            BEGIN
                DELETE_MOVIE_BY_BASE_ID(:base_id, :ret_id);
                COMMIT;
            END;
        `, bindVars);

        await ConnectionFactory.closeConnection(oracleConnection);

        responseBody = {
            op: 'DELETE',
            data: result.outBinds.ret_id,
        };
    } catch (e) {
        console.error(e.message);
        responseBody = {
            op: 'DELETE',
            error: e.message,
        };
    }

    return res.json(responseBody);
};

module.exports = MovieRouter;
