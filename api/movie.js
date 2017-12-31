/**
 * @module MovieRouter
 *
 * Module that handles movies routes
 */

const Router = require('express').Router();

/**
 * Handle movie routes
 *
 * @param { IConnectionPool } connectionPool
 * @return { Router }
 */
const MovieRouter = (connectionPool) => {
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
const getMovieDetails = (req, res) => {
    return res.json({
        id: req.params.base_id,
        op: 'GET-DETAILS',
    });
};

/**
 * Get movie runtime
 *
 * @param { Request } req
 * @param { Response } res
 * @return { Promise }
 */
const getMovieRuntime = (req, res) => {
    return res.json({
        id: req.params.base_id,
        op: 'GET-RUNTIME',
    });
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

module.exports = MovieRouter;
