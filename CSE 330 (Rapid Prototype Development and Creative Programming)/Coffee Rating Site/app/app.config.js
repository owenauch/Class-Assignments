angular.
  module('coffeeApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/coffees', {
          template: '<coffees></coffees>'
        }).
        when('/reviews/:coffeeId', {
          template: '<reviews></reviews>'
        }).
        otherwise('/coffees');
    }
  ]);
