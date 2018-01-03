/**
 * @module OperationsHelper
 *
 * Module used for handling database related operations
 */

const ToCamelcase = require('camelcase');

const OperationsHelper = {
    /**
     * Retrieve data from an open cursor
     *
     * @param { IResultSet } cursor
     * @return { Array<Object> } The data retrieved from the specific cursor
     */
    getObjectsFromResultSet: async (cursor) => {
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
    },
};

module.exports = OperationsHelper;
