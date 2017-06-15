'use strict';

function entitiesDetailCtrl($scope, $stateParams) {
	var entityId = $stateParams.entityId;
	$scope.entityId = entityId;

	$.get(API_BASE + '/publish/entities/' + entityId, function (result) {
		console.log(result);
		$scope.entityData = result;
		$scope.entityData.images.sort( function (a,b) { return a.like_count < b.like_count } );
		$scope.$apply();
	});


	$scope.dataTableOpt = {
		'ajax': {
			'url': API_BASE + '/publish/entities/' + entityId,
			'dataSrc': 'events'
		},
		'columns': [
			{
				'data': 'id',
				'render': function (data, type, full, meta) {
					return '<a href="#/events/' + data + '">#' + data + '</a>';
				},
			},
			{'data': 'title'},
			{'data': 'date'},
			{'data': 'issue_data.issue_score'},
			{
				'data': function (target) {
					if (target.published_time)
						return target.published_time;
					else
						return 'Not yet';
				}
			},
		]
	};
}

angular
	.module('urbanApp')
	.controller('entitiesDetailCtrl', ['$scope', '$stateParams', entitiesDetailCtrl]);
