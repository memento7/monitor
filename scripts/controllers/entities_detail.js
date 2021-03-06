'use strict';

function entitiesDetailCtrl($scope, $state, $stateParams, COLORS) {
	var entityId = $stateParams.entityId;
	$scope.entityId = entityId;

	$state.current.data.title = '엔티티 #' + entityId;

	$.get(API_BASE + '/publish/entities/' + entityId, function (result) {
		//console.log(result);
		$scope.entityData = result;
		$scope.entityData.images.sort( function (a,b) { return a.like_count - b.like_count } );
		$scope.entityData.images = $scope.entityData.images.slice(0, 8);

		$scope.$apply();

		$('#event-table').DataTable({
			"order": [[ 2, "desc" ]]
		});
		
		var events = JSON.parse(JSON.stringify( result.events ));
		events.sort(function (a,b) {
			return (new Date(a.date)).getTime() - (new Date(b.date)).getTime();
		});

		var graphData = [];
		for (var i in events) {
			var dateTimeStamp = (new Date(events[i].date.split(' ')[0])).getTime();
			var lastGraphDataObject = graphData.length ? graphData[graphData.length - 1] : null;

			if (!lastGraphDataObject || lastGraphDataObject.x != dateTimeStamp) {
				var obj = {
					x: dateTimeStamp,
					y: 0
				};
				graphData.push(obj);
				lastGraphDataObject = obj;
			}
			lastGraphDataObject.y += events[i].issue_data.issue_score;
		}
		$scope.series_trends = [{
			color: COLORS.primary,
			name: '이슈 스코어',
			data: graphData
		}];

		$scope.$apply();
	});

	var data = {
		"query": {
			"match": {
				"eid": entityId
			}
		}
	};
	$.ajax(ES_BASE + '/memento/entities/_search', {
		method: 'POST',
		crossDomain: true,
		data: JSON.stringify(data),
		contentType: 'application/json',
		dataType: 'json',
		success: function (result) {
			console.log(result);

			var flag = result.hits.hits[0]['_source']['flag'];

			$.get(ES_BASE + '/memento/namugrim/' + flag, function (result2) {
				console.log(result2);
				$scope.tags = result2._source.tags.slice(0, 100);
				//tags = tags.sort(function(a, b) { return a })
				$scope.$apply();

				$('#keyword-table').DataTable({
                    		 	"order": [[ 1, "desc" ]]
                		});
			});
		}
	});

	$scope.options_trends = {
		renderer: 'area',
		name: 'Area'
	};

	$scope.features_trends = {
		// xAxis: 10000000,
		hover: {
			xFormatter: function (x) {
				return new Date(x).toLocaleString();
			},
			yFormatter: function (y) {
				return Math.round(y);
			}
		}
	};
	$scope.series_trends = [{
		color: COLORS.primary,
		name: '이슈 스코어',
		data: []
	}];
}

angular
	.module('urbanApp')
	.controller('entitiesDetailCtrl', ['$scope', '$state', '$stateParams', 'COLORS', entitiesDetailCtrl]);
