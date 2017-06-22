'use strict';
var jobTable;
var getJobData, getJobDataTimer;
function dashboardCtrl($scope, COLORS, $interval) {
	
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

	if(getJobDataTimer)
		$interval.cancel(getJobDataTimer);
	getJobDataTimer = $interval((getJobData = function() {
		$.get(JOBAPI_BASE + '/jobs', function (result) {
			// console.log(result);
			$scope.jobs = result;
			$scope.jobs = $scope.jobs.filter(function(job) {
				return job.type != "JobTask";
			});
			var count = {"WAITING": 0, "RUNNING": 0};
			$.each($scope.jobs, function(index){
				var job = $scope.jobs[index];
				if(count[job.status] != undefined)
					count[job.status]++;
				var parameter = extractParameter(job);
				job.parameter = parameter;
				if(job.metadata["command_param"] != undefined) {
					var serverId = job.metadata["command_param"].serverId;
					if(serverId != undefined) {
						if($scope.jobserversMap[serverId]["current_job_count"] == undefined)
							$scope.jobserversMap[serverId]["current_job_count"] = 0;
						$scope.jobserversMap[serverId]["current_job_count"]++;	
					}
				}
			});
			$scope.jobcount = count;
			var sumOfMaxJobCount = 0;
			var sumOfJobCount = 0;
			
			$scope.jobservers.forEach(function(jobserver){
				sumOfMaxJobCount += jobserver.max_job_count;
				sumOfJobCount += jobserver["current_job_count"];
			});

			if(jobTable)
				jobTable.destroy();
			$scope.jobutilization = parseInt(sumOfJobCount / sumOfMaxJobCount * 100);
			if(isNaN($scope.jobutilization))
				$scope.jobutilization = 0;
			$scope.jobutilization += "%";
			$scope.$apply();

			jobTable = $('#job-table').DataTable({
				"order": [[ 0, "asc" ]]
			});
		});

		function extractParameter(job) {
			if(job.metadata.error != undefined)
				return job.metadata.error;
			if(job.type == "SSHShellExecuteTask") {
				return job.metadata.command_param.command;
			} else if(job.type == "MementoCrawlTask") {
				var param = job.metadata.memento_crawl_param;
				return param.entity + ", " + new Date(param.fromDate).yyyymmdd() + "~" + new Date(param.toDate).yyyymmdd() + ", " + param.elasticJobId;
			} else if(job.type == "MementoClusterTask") {
				var param = job.metadata.memento_cluster_param;
				return param.entity + ", " + new Date(param.fromDate).yyyymmdd() + "~" + new Date(param.toDate).yyyymmdd() + ", " + param.elasticJobId;
			}
		}	
	}), 3500);
	getJobData();
}

angular
	.module('urbanApp')
	.controller('dashboardCtrl', ['$scope', 'COLORS', '$interval', dashboardCtrl]);

