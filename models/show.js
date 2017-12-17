/**
 * @module Show
 */
const Base = require('./base').Base;

/**
 * Show class
 *
 * @class Show
 * @extends {Base}
 */
class Show extends Base {
    /**
     * Creates an instance of Show.
     *
     * @param { !Number } id            Id of entity (Base).
     * @param { !BaseType } type        The type of entity (Base).
     * @param { !String } imdbLink      Unique IMDB link.
     * @param { !String } name          Name of the TV Show.
     * @param { String= } description   IMDB of other third party description.
     * @param { String= } imageUrl      IMDB or other third-party image.
     * @param { !Number } episodeRuntime      The runtime of a singe episode.
     * @memberof Show
     */
    constructor(id, type, imdbLink, name, description, imageUrl, episodeRuntime) {
        super(id, type, imdbLink);

        /**
         * @type { String }
         * @private
         */
        this.name = name;

        /**
         * @type { String }
         * @private
         */
        this.description = description;

        /**
         * @type { String }
         * @private
         */
        this.imageUrl = imageUrl;

        /**
         * @type { Number }
         * @private
         */
        this.episodeRuntime = episodeRuntime;
    }
}

/**
 * @typedef { String } BaseType
 */

module.exports = Show;
