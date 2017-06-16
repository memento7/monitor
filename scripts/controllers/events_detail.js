'use strict';

function eventsDetailCtrl($scope, $state, $stateParams) {
	var eventId = $stateParams.eventId;
	$scope.eventId = eventId;

	$state.current.data.title = '이벤트 #' + eventId;

	$.get(API_BASE + '/publish/events/' + eventId, function (result) {
		console.log(result);
		$scope.eventData = result;
		$scope.$apply();

		$('#keyword-table').DataTable({
			"order": [[ 1, "desc" ]]
		});

		$('#entities-table').DataTable({
			"order": [[ 1, "desc" ]]
		});
	});
}

angular
	.module('urbanApp')
	.controller('eventsDetailCtrl', ['$scope', '$state', '$stateParams', eventsDetailCtrl]);
