'use strict';

function dashboardCtrl($scope, COLORS) {
	
	$scope.entitiesTrend = {
		options: {
			renderer: 'area',
			name: 'Area'
		},
		features: {
			yAxis: true,
			hover: {
				xFormatter: function (x) {
					return new Date(x).toLocaleString();
				},
				yFormatter: function (y) {
					return Math.round(y);
				}
			}
		},
		series: [{
			color: COLORS.primary,
			name: '엔티티 수',
			data: []
		}]
	};

	
	$scope.eventsTrend = {
		options: {
			renderer: 'area',
			name: 'Area'
		},
		features: {
			yAxis: true,
			hover: {
				xFormatter: function (x) {
					return new Date(x).toLocaleString();
				},
				yFormatter: function (y) {
					return Math.round(y);
				}
			}
		},
		series: [{
			color: COLORS.primary,
			name: '이벤트 수',
			data: []
		}]
	};

	
	$.get(API_BASE + '/publish/entities?createdTime,desc&size=10000', function (result) {
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

		$scope.entitiesTrend.series = [{
			color: '#fe646e',
			name: '엔티티 수',
			data: graphData
		}];

		$scope.$apply();
	});
	


		
	$.get(API_BASE + '/publish/events/count/date?recentDays=1300', function (result) {
		var graphData = [];
		
		for (var datetime in result) {
			graphData.push({
				'x': (new Date(datetime)).getTime(),
				'y': result[datetime]
			})
		}
		graphData.sort(function(a, b) { return a.x - b.x });
	
		$scope.eventsTrend.series = [{
			color: '#f79384',
			name: '이벤트 수',
			data: graphData
		}];

		$scope.$apply();
	});
}

angular
	.module('urbanApp')
	.controller('dashboardCtrl', ['$scope', 'COLORS', dashboardCtrl]);

