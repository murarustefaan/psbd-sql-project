/**
 * @module Base
 */

/**
 * Base class to be extended by Movie and Show.
 * Contains the basic properties every Movie or TV Show should have.
 * Cannot be instantiated itself.
 *
 * @class Base
 */
class Base {
    /**
     * @param { !Number } id
     * @param { !BaseType } type
     * @param { !String } imdbLink
     * @private
     */
    constructor(id, type, imdbLink) {
        /**
         * @type { !Number }
         * @private
         */
        this.id = id;

        /**
         * @type { !BaseType }
         * @private
         */
        this.type = type;

        /**
         * @type { !String }
         * @private
         */
        this.imdb_link = imdbLink;
    }
}

/**
 * @typedef { String } BaseType
 */

/**
 * Base types.
 *
 * @readonly
 * @enum { BaseType }
 */
const BaseTypes = {
    /* Movie type */
    MOVIE: 'movie',
    /* TV Show type */
    SHOW: 'show',
};

module.exports = {Base, BaseTypes};
