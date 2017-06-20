'use strict';

function instancesCtrl($scope, COLORS) {
	
	$scope.test = 'Hi, hello';
	
}

angular
	.module('urbanApp')
	.controller('instancesCtrl', ['$scope', 'COLORS', instancesCtrl]);
