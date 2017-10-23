'use strict';
var jobServerTable, jobHistoryTable, jobTable;
var getData, getDataTimer;
function jobsCtrl($scope, COLORS, $interval) {
	
	if(getDataTimer)
		$interval.cancel(getDataTimer);
	getDataTimer = $interval((getData = function() {
		$.get(JOBAPI_BASE + '/jobservers?size=1000', function (result) {
			// console.log(result);
			$scope.jobservers = result;
			$scope.jobserversMap = {};

			$.each(result, function(index){
				var jobserver = result[index];
				$scope.jobserversMap[jobserver.id] = jobserver;
				jobserver["current_job_count"] = 0;
			});
			if(jobServerTable)
				jobServerTable.destroy();
			$scope.$apply();
			jobServerTable = $('#jobserver-table').DataTable({
				"order": [[ 2, "desc" ]]
			});

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
					if(parameter == undefined)
						parameter = "";
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
		});

        $('#jobhistory-table').DataTable().clear().destroy();
        $('#jobhistory-table').DataTable({
            "processing": true,
            "serverSide": true,
            "bSort": false,
            "ajax":function (data, callback, settings) {
                // Pageable에 맞게끔 파라메터를 가공
                var page = data.start / data.length;
                var size = data.length;
                var search = data.search.value;
                var orders = "startTime,desc";
                var draw = data.draw;

                // 가공된 파라메터로 요청
                $.ajax({url: JOBAPI_BASE + '/jobs/histories',
                    data: $.extend({}, {
                        "page": page,
                        "size": size,
                        "searchString": search,
                        "sort": orders
                    }),
                    success: function(data){
                        var content = data["content"].filter(function(job){
                        	return job.type != "JobTask";
                        });
                        $.each(content, function(index){
                            var job = data["content"][index];
                            var parameter = extractParameter(job);
                            job.parameter = parameter;
                        });

                        // 결과값을 DataTables에 맞게 다시 가공
                        callback({
                            "draw": draw,
                            "recordsFiltered": data["totalElements"],
                            "recordsTotal": data["totalElements"],
                            "data": content
                        });
                    }});

            },
            columns: [
                { title: "ID", data: "id", "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='#/jobs/" + oData.id + "?isHistory=true' class='page-item'>" + oData.id + "</a>");
                } },
        		{ title: "타입", data: "type" },
				{ title: "파라메터", data: "parameter" },
				{ title: "순서", data: "order_index" },
				{ title: "시작시간", data: "start_time" },
				{ title: "종료시간", data: "end_time" },
				{ title: "상태", data: "status" }
            ],
            "order": [[ 4, "desc" ]]
        });
        //
		// $.get(JOBAPI_BASE + '/jobs/histories', function (result) {
		// 	// console.log(result);
		// 	$scope.jobhistories = result;
		// 	$scope.jobhistories = $scope.jobhistories.filter(function(job) {
		// 		return job.type != "JobTask";
		// 	});
		// 	$.each(result, function(index){
		// 		var job = result[index];
		// 		var parameter = extractParameter(job);
		// 		job.parameter = parameter;
		// 	});
        //
		// 	if(jobHistoryTable)
		// 		jobHistoryTable.destroy();
		// 	$scope.$apply();
		// 	jobHistoryTable = $('#jobhistory-table').DataTable({
        //
		// 	});
		// });

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
			return "None";
		}	
	}), 30000);
	getData();
}

angular
	.module('urbanApp')
	.controller('jobsCtrl', ['$scope', 'COLORS', '$interval', jobsCtrl]);
