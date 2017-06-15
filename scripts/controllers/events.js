'use strict';

function eventsCtrl($scope, COLORS) {
	$scope.options1 = {
		renderer: 'area'
	};

	$scope.features1 = {
		xAxis: true,
		hover: {
			xFormatter: function (x) {
				return new Date(x * 1000).toString();
			},
			yFormatter: function (y) {
				return Math.round(y);
			}
		}
	};

	$scope.series1 = [{
		color: COLORS.primary,
		name: 'Series1',
		data: [{
			x: -1893456000,
			y: 92228531
				}, {
			x: -1577923200,
			y: 106021568
				}, {
			x: -1262304000,
			y: 123202660
				}, {
			x: -946771200,
			y: 132165129
				}, {
			x: -631152000,
			y: 151325798
				}, {
			x: -315619200,
			y: 179323175
				}, {
			x: 0,
			y: 203211926
				}, {
			x: 315532800,
			y: 226545805
				}, {
			x: 631152000,
			y: 248709873
				}, {
			x: 946684800,
			y: 281421906
				}, {
			x: 1262304000,
			y: 308745538
				}]
		}];

	$scope.dataTableOpt = {
		'ajax': {
			'url': 'https://api.memento.live/publish/events?size=10000',
			'dataSrc': ''
		},
		'columns': [
			{'data': 'id'},
			{'data': 'nickname'},
			{'data': 'realname'},
			{
				'data': function (target) {
					var roles = [];
					for (var role in target.role_json) {
						roles.push(role);
					}
					return roles.join(',');
				}
			},
			{'data': 'status'},
			{'data': 'created_time'},
			//{'data': 'updated_time'}
			{
				'data': function (target) {
					if (target.updated_time)
						return target.updated_time;
					else
						return 'Not yet';
				}
			},
		]
	};

	$scope.$watch($scope.getWidth, function () {
		$scope.options1 = {
			renderer: 'area'
		};
		$scope.options2 = {
			renderer: 'area'
		};
	});
}

angular
	.module('urbanApp')
	.controller('eventsCtrl', ['$scope', 'COLORS', eventsCtrl]);
