angular.module('app.controllers', ['app.services'])
  
.controller('loginCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService, BackendService) {
    var self = this;
    $scope.credentials = { email: undefined, password: undefined };
    $scope.storeCredentials = {localStorageSupport: false, password: false, email: false };
    init();
    function init() {
        if (localStorageService.isSupported) {
            if (localStorageService.get('storeCredentials') != undefined) {
                $scope.storeCredentials = JSON.parse(localStorageService.get('storeCredentials'));
            }
            $scope.storeCredentials.localStorageSupport = true;
            if ($scope.storeCredentials.email && localStorageService.get('email') != undefined) {
                $scope.credentials.email = localStorageService.get('email');
            }
        }
    }

    $scope.submit = function (form) {
        if (form.$valid) {
            if ($scope.storeCredentials.localStorageSupport) {
                localStorageService.set('storeCredentials', JSON.stringify($scope.storeCredentials));
                if ($scope.storeCredentials.email) {
                    localStorageService.set('email', $scope.credentials.email)
                } else {
                    localStorageService.remove('email');
                }
            }
            BackendService.login($scope.credentials);
        } else {
            console.log("Form is not valid");
        }
    };
})
   
.controller('signupCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, localStorageService, BackendService) {
    var self = this;
    $scope.fullNamePattern = new RegExp('[A-Za-z\-]+\\s+[A-Za-z\-]+');
    $scope.pricePattern = new RegExp('\\d+\\.?\\d{0,2}');
    $scope.registrationInfo = {};
    $scope.registrationInfo.fullName = undefined;
    $scope.registrationInfo.carInfo = undefined;
    $scope.registrationInfo.pricePerKm = undefined;
    $scope.registrationInfo.email = undefined;
    $scope.registrationInfo.password = undefined;

    $scope.submit = function (regForm) {
        if (regForm.$valid) {
            BackendService.signup($scope.registrationInfo);
        }
    };

})
    
.controller('waitingScreenCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope,$state, $stateParams, BackendService, $ionicPlatform, $ionicPopup) {
    $scope.currentStatus = { active: BackendService.currentUser.acceptinOrders };
    var statusText = ['Accept orders', 'Go into "Busy" mode']
    $scope.statusText = statusText[0];
    $scope.changeStatus = changeStatus;
    
    function customBack() {
        $ionicPopup.confirm({
            title: 'Log out',
            template: 'You will be logged out. Do you want to proceed?'
        }).then(function(res){
            if (res) {                
                BackendService.logout();
                $state.go('login');
            }  
        })
    };
    
    var oldSoftBack = $rootScope.$ionicGoBack;
    $rootScope.$ionicGoBack = function () {
        customBack();
    };
    var deregisterSoftBack = function () {
        $rootScope.$ionicGoBack = oldSoftBack;
    };

    var deregisterHardBack = $ionicPlatform.registerBackButtonAction(
        customBack, 101
    );

    $scope.$on('$destroy', function () {
        deregisterHardBack();
        deregisterSoftBack();
    });

    function changeStatus() {
        $scope.currentStatus.active = !$scope.currentStatus.active;
        $scope.statusText = statusText[1 - statusText.indexOf($scope.statusText)];
        BackendService.changeStatus($scope.currentStatus.active);
    }
})
 