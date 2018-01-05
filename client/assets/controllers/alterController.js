app.controller(`alterController`, [`$state`, `alterService`, alterControllerFn])

function alterControllerFn ($state, alterService) {
	const self = this;

	$state.transitionTo(`alter.movies`);

    Date.prototype.APIFormat = function(){
        return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`;
    };

	this.alter = function () {
		if (!self.currentMovie || !self.currentMovie.name || !self.currentMovie.type) {
			return;
		}

		console.log(self.currentMovie);

		alterService.alter(Object.assign(self.currentMovie, {releaseDate: new Date(self.currentMovie.releaseDate).APIFormat()}))
			.then(onAlterSuccess, onAlterFailed);

		function onAlterSuccess(response) {
			console.log(response);
		}

		function onAlterFailed(err) {
			console.log(err);
		}
	};

	this.deleteEntry = function () {
        if (!self.currentMovie || !self.currentMovie.baseId || !self.currentMovie.type) {
            console.log(self.currentMovie);
        	return;
        }

        alterService.deleteEntry(self.currentMovie.baseId, self.currentMovie.type)
			.then(onDeleteSuccess, onDeleteFailed);

        function onDeleteSuccess(response) {
        	console.log(response);
        	self.currentMovie = undefined;
		}

		function onDeleteFailed(err) {
        	console.error(err);
		}
	};

	this.updateSelectedItemInfo = function updateSelectedItemInfo() {

		if (!self.currentMovie || !self.currentMovie.type || !self.currentMovie.baseId) {
			console.error(`!currentMovie info`);
			return;
		}

		alterService.getInfo(self.currentMovie.type, self.currentMovie.baseId)
			.then(onGetInfoSuccess, onGetInfoError);



		function onGetInfoSuccess(results) {
			self.currentMovie = Object.assign(self.currentMovie, results.data.data[0]);
			console.log(self.currentMovie);
		}

		function onGetInfoError(err) {
			console.error(`Error happened: ${err}`);
		}

	};

	this.getMatches = function getMatches (searchText, type) {

        let foundEntries = [];

        if (!searchText || !type) {
        	return console.error(`!text || !type`);
        }

        return alterService.find(searchText, type)
            .then(onSuccess, onReject);

        function onSuccess (response) {
            if (!response || !response.data) {
                console.error(`No results in the response`);
                return;
            }

            foundEntries = response.data.data;

            return foundEntries;
        }

        function onReject (error) {
            console.error(error);

            return error;
        }
    };

}