'use strict';

function eventsCtrl($scope, COLORS) {
	
	$scope.options_trends = {
		renderer: 'area',
		name: 'Area'
	};

	$scope.features_trends = {
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
		name: '이벤트 수',
		data: []
	}];

	$.get(API_BASE + '/publish/events/count/date?recentDays=1300', function (result) {
		var graphData = [];
		
		for (var datetime in result) {
			graphData.push({
				'x': (new Date(datetime)).getTime(),
				'y': result[datetime]
			})
		}
		graphData.sort(function(a, b) { return a.x - b.x });
	
		$scope.series_trends = [{
			color: COLORS.primary,
			name: '이벤트 수',
			data: graphData
		}];

		$scope.$apply();
	});
	
	var now = new Date();
	var day7ago = new Date(now.getTime());
	day7ago.setDate(now.getDate() - 7);

	$scope.eventDateRange = day7ago.toISOString().split("T")[0] + ' - ' + now.toISOString().split("T")[0];
	$scope.$watch('eventDateRange', function (newVal, oldVal) {
		var tmp = newVal.split(" - ");
		var start = tmp[0];
		var end = tmp[1];

		console.log(start + " ~ " + end);
		loadEvents(start, end)
	});
	
	var eventsTable;
	function loadEvents(startDate, endDate) {
		$.get(API_BASE + '/publish/events/between?fromDate='+startDate+'&toDate='+endDate + '&size=1000', function (result) {
			if (eventsTable)
				eventsTable.destroy();			

			$scope.events = result;
			$scope.$apply();
			
			eventsTable = $('#events-table').DataTable({
				"order": [[ 4, "desc" ]]
			});

		});
	}
}

angular
	.module('urbanApp')
	.controller('eventsCtrl', ['$scope', 'COLORS', eventsCtrl]);
