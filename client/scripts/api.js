/**
 * @module ApiHelper
 * 
 * Module that handles API queries
 */

const API_ENDPOINT = 'http://localhost:8080/api';

/**
 * Get all the records from the server, no limit.
 * 
 * @return { Object }
 */
const getAll = async () => {
    try {
        const res = await fetch(`${API_ENDPOINT}/search/all`);
        const data = await res.json();

        return data;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export default {
    getAll,
};