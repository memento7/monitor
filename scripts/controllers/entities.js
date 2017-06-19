'use strict';

function entitiesCtrl($scope, COLORS) {
	
	$scope.options_trends = {
		renderer: 'area',
		name: 'Area'
	};

	$scope.features_trends = {
		// xAxis: 10000000,
		yAxis: true,
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
		name: '엔티티 수',
		data: []
	}];
	
	$.get(API_BASE + '/publish/entities?createdTime,desc&size=10000', function (result) {
		$scope.entities = result;
		
		$scope.$apply();

		$('#entities-table').DataTable({
			"order": [[ 5, "desc" ]]
		});
		
		var graphData = [];

		for (var i = 0; i < result.length; i++) {
			var dateTimeStamp = (new Date(result[i].created_time.split(' ')[0])).getTime();
			var lastGraphDataObject = graphData.length ? graphData[graphData.length - 1] : null;
			
			if (!lastGraphDataObject || lastGraphDataObject.x != dateTimeStamp) {
				var obj = {
					x: dateTimeStamp,
					y: (lastGraphDataObject ? lastGraphDataObject.y : 0)
				};
				graphData.push(obj);
				lastGraphDataObject = obj;
			}
			lastGraphDataObject.y += 1;
		}

		$scope.series_trends = [{
			color: COLORS.primary,
			name: '엔티티 수',
			data: graphData
		}];

		$scope.$apply();
	});
	
}

angular
	.module('urbanApp')
	.controller('entitiesCtrl', ['$scope', 'COLORS', entitiesCtrl]);
