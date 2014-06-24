var App = angular.module('dayz-epoch-monitor', ['ngRoute'])


App.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/dashboard'
        })
        .when('/dashboard', {
            controller: 'DashboardCtrl',
            templateUrl: 'partials/dashboard.html'
        })
        .when('/map', {
            controller: 'MapCtrl',
            templateUrl: 'partials/map.html'

        })
        .when('/players', {
            controller: 'PlayersCtrl',
            templateUrl: 'partials/players.html'
        })
        .when('/players/:PlayerName', {
            controller: 'PlayerCtrl',
            templateUrl: 'partials/player.html'
        })
        .otherwise({
            redirectTo: '/'
        })
        
    //$locationProvider.html5Mode(true);
});

App.directive('google-map', function() {
  return {
      restrict: 'AE',
      template: '<div id="map-canvas"></div>'
  };
});
