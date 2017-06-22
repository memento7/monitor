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

		var entitiesTable = $('#entities-table').DataTable({
			"order": [[ 1, "desc" ]]
		});
		var entitiesMap = {};
		if($scope.eventData.entities) {
			$.each($scope.eventData.entities, function(entity){
				entitiesMap[entity.nickname] = entity;
			});
		}

		$.get("http://server2.memento.live:6023/accuracy/" + eventId, function(result) {
			$.each(result, function(index) {
				var obj = result[index];
				if(entitiesMap[obj.entity]) {
					entitiesMap[obj.entity].accuracy = Number(obj.value).toFixed(2);
					entitiesMap[obj.entity].include = "O";
				} else {
					$scope.eventData.entities.push({
						"id": obj.id,
						"nickname": obj.entity,
						"accuracy": Number(obj.value).toFixed(2),
						"include": obj.value > 0.025 ? "O" : "X"
					});
				}
			});

			if(entitiesTable)
				entitiesTable.destory();
			$scope.$apply();
			entitiesTable = $('#entities-table').DataTable({
				"order": [[ 1, "desc" ]]
			});
		});
	});
}

angular
	.module('urbanApp')
	.controller('eventsDetailCtrl', ['$scope', '$state', '$stateParams', eventsDetailCtrl]);
