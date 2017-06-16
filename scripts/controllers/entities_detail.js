'use strict';

function entitiesDetailCtrl($scope, $stateParams) {
	var entityId = $stateParams.entityId;
	$scope.entityId = entityId;

	$.get(API_BASE + '/publish/entities/' + entityId, function (result) {
		console.log(result);
		$scope.entityData = result;
		$scope.entityData.images.sort( function (a,b) { return a.like_count < b.like_count } );

		$scope.$apply();

		$('#event-table').DataTable({
			"order": [[ 2, "desc" ]]
		});
	});
}

angular
	.module('urbanApp')
	.controller('entitiesDetailCtrl', ['$scope', '$stateParams', entitiesDetailCtrl]);
