app.service(`alterService`, [`$http`, alterServiceFn]);

function alterServiceFn($http) {

	return {
		getInfo: getInfo,
		find: find,
		alter: alter,
		deleteEntry: deleteEntry
	};

	function getInfo(type, base_id) {

		return $http.get(`http://localhost:8080/api/${type}/${base_id}`);

	}

	function find (name, type) {

        if (!name || !type) {
            return null;
        }

        return $http.get(
            `http://localhost:8080/api/search`,
            { 
            	params: { 
            		name,
            		type
         		} 
         	}
        );

    }

    function alter(info) {

		return $http.post(`http://localhost:8080/api/${info.type}`, info)

	}

	function deleteEntry(base_id, type) {

		return $http.delete(`http://localhost:8080/api/${type}/${base_id}`);

	}

}