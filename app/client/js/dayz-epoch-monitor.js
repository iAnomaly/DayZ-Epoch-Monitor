var App = angular.module('dayz-epoch-monitor', ['ngRoute'])


App.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: 'partials/dashboard.html'
        })
        .when('/map', {
            controller: 'MapCtrl',
            templateUrl: 'partials/map.html'

        })
        .when('/players', {
            controller: 'PlayerCtrl',
            templateUrl: 'partials/players.html'
        })
        .otherwise({
            redirectTo: '/'
        });
})

// .controller('MapCtrl', function($scope) {
//     $scope.mapOptions = {
//         center: new google.maps.LatLng(-34.397, 150.644),
//         zoom: 8
//     };
//     $scope.map = new google.maps.Map($scope.map-canvas, mapOptions);
// });