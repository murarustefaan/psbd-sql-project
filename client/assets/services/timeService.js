app.service(`timeService`, [`$http`, timeServiceFn]);

function timeServiceFn($http) {

    return {
        find: find,
        getRuntime: getRuntime
    };

    function find (name) {

        if (!name) {
            return null;
        }

        return $http.get(
            `http://localhost:8080/api/search`,
            { params: { name } }
        );

    }

    function getRuntime (type, id) {

        if (!id ||
            !type ||
            type !== `movie` && type !== `show`) {
            return null;
        }

        return $http.get(`http://localhost:8080/api/${type}/${id}/runtime`);

    }

}