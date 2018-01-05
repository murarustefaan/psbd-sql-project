app.controller(`appController`, [`timeService`, appControllerFn]);

function appControllerFn(timeService) {
    const self = this;

    this.title = `tiiime - College project`

    this.totalRuntime = 0;

    this.totalRuntimeLabel = ``;

    this.watchedMovies = [];
    this.watchedShows = [];

    self.watchingLabel = ``;

    this.backgroundUrl = `./assets/img/default_background_2.jpg`;

    this.getMatches = function getMatches (searchText) {

        let foundEntries = [];

        return timeService.find(searchText)
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

    this.addNewEntry = function addNewEntry(entry) {

        if (!entry) {
            return;
        }

        timeService.getRuntime(entry.type, entry.baseId)
            .then(onSuccess, onError);

        function onSuccess (response) {

            entry.runtime = response.data.runtime;

            if (entry.type === `movie`) {

                self.watchedMovies.push(entry);

            } else {

                self.watchedShows.push(entry);

            }

            self.totalRuntime = self.totalRuntime + entry.runtime;

            if (self.totalRuntime) {

                const daysLost = parseInt(self.totalRuntime / 24 / 60);
                const hoursLost = parseInt(self.totalRuntime / 60 % 24);
                const minutesLost = parseInt(self.totalRuntime % 60);
                self.totalRuntimeLabel = `Congratulations, you lost ${daysLost} days, ${hoursLost} hours and ${minutesLost} minutes`;

            }

            const watchingMovies = self.watchedMovies.length ? self.watchedMovies.length + (self.watchedMovies.length === 1 ? ' movie' : ' movies') : '';
            const watchingShows = self.watchedShows.length ? self.watchedShows.length + (self.watchedShows.length === 1 ? ' show' : ' shows') : '';

            if (watchingMovies.length && watchingShows.length) {

                self.watchingLabel = `watching ${watchingMovies} and ${watchingShows}`;

            } else if (watchingMovies.length || watchingShows.length) {

                if (watchingMovies) {
                    self.watchingLabel = `watching ${watchingMovies}`;
                } else {
                    self.watchingLabel = `watching ${watchingShows}`;
                }

            } else {

                self.watchingLabel = ``;

            }

            const backgroundUrl = entry.image_url ? `http://image.tmdb.org/t/p/original${entry.image_url}` : self.backgroundUrl;
            angular.element(`span.background`)[0].style.backgroundImage = `url("${backgroundUrl}")`;

        }

        function onError (error) {

            console.error(error);

        }

    }

}