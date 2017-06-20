'use strict';

function instancesDetailCtrl($scope, $state, $stateParams, COLORS) {
	var instanceId = $stateParams.instanceId;
	$scope.instanceId = instanceId;

	$state.current.data.title = '인스턴스 #' + instanceId;
}

angular
	.module('urbanApp')
	.controller('instancesDetailCtrl', ['$scope', '$state', '$stateParams', 'COLORS', instancesDetailCtrl]);
