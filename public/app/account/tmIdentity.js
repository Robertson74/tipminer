(function (angular) {
    angular.module('app').factory('tmIdentity', ['$window', 'tmUser', Factory]);
    function Factory($window, tmUser) {
        var currentUser;
        if (!!$window.bootstrappedUserObject) {
            currentUser = new tmUser();
            angular.extend(currentUser, $window.bootstrappedUserObject);

        }

        return {

            currentUser: currentUser,

            isAuthenticated: function () {
                return !!this.currentUser;
            },
            isAuthorized: function (role) {
                return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
            }
        };
    }
}(this.angular));
