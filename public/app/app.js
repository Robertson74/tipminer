angular.module('app', ['ngResource','ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider)
{
    var routeRoleChecks = {
        admin: {
            auth: function(tmAuth){
                return tmAuth.authorizeCurrentUserForRoute('admin');
            }
        },
        user: {
            auth: function(tmAuth){
                return tmAuth.authorizeAuthenticatedUserForRoute();
            }
        }
    }

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main/main',
            controller: 'tmMainCtrl'
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'tmSignupCtrl'
        })
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller: 'tmProfileCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/contracts', {
            templateUrl: '/partials/contracts/contracts-list',
            controller: 'tmContractsCtrl'})
        .when('/bids', {
            templateUrl: '/partials/bids/bids-list',
            controller: 'tmBidsCtrl'
        })
        .when('/admin/users', {
            templateUrl: '/partials/admin/user-list',
            controller: 'tmUserListCtrl',
            resolve: routeRoleChecks.admin
        })
        .when('/devnotes/notes', {
            templateUrl: '/partials/devnotes/notes-list',
            controller: 'tmDevNotesCtrl',
            resolve: routeRoleChecks.admin
        })
        .when('/contracts/:id', {
            templateUrl: '/partials/contracts/contract-details',
            controller: 'tmContractDetailsCtrl'
        });

});

angular.module('app').run(function($rootScope, $location){

    $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection){

            if(rejection === 'not authorized'){
                $location.path('/');
            }
    })

})

