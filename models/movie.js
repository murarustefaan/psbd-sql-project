/**
 * @module Movie
 */
const Base = require('./base').Base;

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
     * @param { !BaseType } type        The type of entity (Base).
     * @param { !String } imdbLink      Unique IMDB link.
     * @param { !String } name          Name of the movie.
     * @param { !Number } length        Length of the movie (in minutes).
     * @param { !Date } releaseDate     Release date.
     * @param { String= } imageUrl      IMDB or other third-party image url for the movie
     * @param { String= } description   IMDB or other third-party description.
     * @memberof Movie
     */
    constructor(id, type, imdbLink, name, length, releaseDate, imageUrl, description) {
        super(id, type, imdbLink);

        this.name = name;
        this.length = length;
        this.releaseDate = releaseDate;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

/**
 * @typedef { String } BaseType
 */

module.exports = {Movie};
