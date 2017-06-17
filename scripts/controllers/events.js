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

	$scope.eventDateRange = '2000-01-01 - 2017-06-30';
	$scope.$watch('eventDateRange', function (newVal, oldVal) {
		var tmp = newVal.split(" - ");
		var start = tmp[0];
		var end = tmp[1];

		console.log(start + " ~ " + end)
	});


	$.get(API_BASE + '/publish/events/updated', function (result) {
		$scope.events = result;
		$scope.$apply();

		$('#events-table').DataTable({
			"order": [[ 4, "desc" ]]
		});

	});
}

angular
	.module('urbanApp')
	.controller('eventsCtrl', ['$scope', 'COLORS', eventsCtrl]);
