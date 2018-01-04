/**
 * @module OperationsHelper
 *
 * Module used for handling database related operations
 */

const ToCamelcase = require('camelcase');

const OperationsHelper = {
    /**
     * Retrieve data from an open cursor.
     * The second parameter will be used to limit the number of records extracted from a cursor.
     * If missing, all records available will be extracted.
     *
     * @param { IResultSet } cursor
     * @param { Number } [limit]
     * @return { Array<Object> } The data retrieved from the specific cursor
     */
    getObjectsFromResultSet: async (cursor, limit) => {
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
        } while (obj !== null && (!limit || objects.length < limit));

        return objects;
    },
};

module.exports = OperationsHelper;
