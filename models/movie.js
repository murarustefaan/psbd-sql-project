/**
 * @module Movie
 */
const Base = require('./base').Base;
const BaseTypes = require('./base').BaseTypes;

/**
 * Movie class.
 *
 * @class Movie
 * @extends {Base}
 */
class Movie extends Base {
    /**
     * Creates an instance of Movie.
     * @param { !Number } id            Id of entity (Base).
     * @param { !String } imdbLink      Unique IMDB link.
     * @param { !String } name          Name of the movie.
     * @param { !Number } length        Length of the movie (in minutes).
     * @param { !Date } releaseDate     Release date.
     * @param { String= } imageUrl      IMDB or other third-party image url for the movie
     * @param { String= } description   IMDB or other third-party description.
     * @memberof Movie
     */
    constructor(id, imdbLink, name, length, releaseDate, imageUrl, description) {
        super(id, BaseTypes.MOVIE, imdbLink);

        /**
         * @type { String }
         * @private
         */
        this.name = name;

        /**
         * @type { Number }
         * @private
         */
        this.length = length;

        /**
         * @type { Date }
         * @private
         */
        this.releaseDate = releaseDate;

        /**
         * @type { String }
         * @private
         */
        this.imageUrl = imageUrl;

        /**
         * @type { String }
         * @private
         */
        this.description = description;
    }
}

/**
 * @typedef { String } BaseType
 */

module.exports = Movie;
