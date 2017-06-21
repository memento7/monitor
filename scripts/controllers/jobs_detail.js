'use strict';

function jobsDetailCtrl($scope, $state, $stateParams, COLORS) {
	var isHistory = $stateParams.isHistory;
	var jobId = $stateParams.jobId;

	$state.current.data.title = '잡 #' + jobId;

	if(isHistory) {
		$.get(JOBAPI_BASE + '/jobs/histories/' + jobId, function (result) {
			// console.log(result);
			var job = result;
			job.parameter = extractParameter(job);
			$scope.job = job;
			$scope.$apply();
		});
	} else {
		$.get(JOBAPI_BASE + '/jobs/' + jobId, function (result) {
			// console.log(result);
			var job = result;
			job.parameter = extractParameter(job);
			$scope.job = job;
			$scope.$apply();
		});
	}

	

	function extractParameter(job) {
		if(job.metadata.error != undefined)
			return job.metadata.error;
		if(job.type == "SSHShellExecuteTask") {
			return job.metadata.command_param.command;
		} else if(job.type == "MementoCrawlTask") {
			var param = job.metadata.memento_crawl_param;
			return param.entity + ", " + param.fromDate + "~" + param.toDate + ", " + param.elasticJobId;
		} else if(job.type == "MementoClusterTask") {
			var param = job.metadata.memento_cluster_param;
			return param.entity + ", " + param.fromDate + "~" + param.toDate + ", " + param.elasticJobId;
		}
	}
}

angular
	.module('urbanApp')
	.controller('jobsDetailCtrl', ['$scope', '$state', '$stateParams', 'COLORS', jobsDetailCtrl]);
