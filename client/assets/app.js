const app = angular.module(`tiiime`, [`ngMaterial`, `ui.router`, `ngMessages`]);

app.config([`$locationProvider`, `$stateProvider`, `$urlRouterProvider`, configFn]);

function configFn ($locationProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise(`/`);

    $locationProvider.html5Mode(true);

    $stateProvider

        .state(`overview`, {
            url: `/`,
            templateUrl: `./assets/views/overview.html`
        })

        .state(`alter`, {
            templateUrl: `./assets/views/alter.html`,
            controller: `alterController as AC`,
        })

        .state(`alter.movies`, {
            templateUrl: `./assets/views/alter.movies.html`,
            url: `/movies`
        })

        .state(`alter.shows`, {
            templateUrl: `./assets/views/alter.shows.html`,
            url: `/shows`
        });

}