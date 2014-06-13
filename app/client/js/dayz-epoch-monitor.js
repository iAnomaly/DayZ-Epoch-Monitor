angular.module('dayz-epoch-monitor', ['ngRoute'])

.factory('Test', function($http) {

})

.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/map'
        })
        .when('/map', {
            controller: 'MapCtrl',
            templateUrl: 'partials/map.html'

        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.responseInterceptors.push(['$location', '$q',
        function($location, $q) {
            function sucess(res) {
                return res;
            }

            function error(res) {
                $location.path('/signin');
                $q.reject(res);
            }

            return function(promise) {
                return promise.then(sucess, error);
            }
        }
    ]);
})

.controller('MapCtrl', function($scope) {
    $scope.mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8
    };
    $scope.map = new google.maps.Map($scope.map-canvas, mapOptions);
});