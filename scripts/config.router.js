'use strict';

angular
	.module('urbanApp')
	.run(['$rootScope', '$state', '$stateParams',
		function ($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.$on('$stateChangeSuccess', function () {
				window.scrollTo(0, 0);
			});
			FastClick.attach(document.body);
		},
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

			// For unmatched routes
			$urlRouterProvider.otherwise('/');

			// Application routes
			$stateProvider
				.state('app', {
					abstract: true,
					templateUrl: 'views/common/layout.html',
				})
				.state('app.dashboard', {
					url: '/',
					templateUrl: 'views/dashboard.html',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load([
								{
									serie: true,
									files: [
										'vendor/flot/jquery.flot.js',
										'vendor/flot/jquery.flot.resize.js',
										'vendor/flot/jquery.flot.pie.js',
										'vendor/flot/jquery.flot.categories.js',
									]
								},
								{
									name: 'angular-flot',
									files: [
										'vendor/angular-flot/angular-flot.js'
									]
								}
							]).then(function () {
								return $ocLazyLoad.load('scripts/controllers/dashboard.js');
							});
						}]
					},
					data: {
						title: '대시보드',
					}
				})
				.state('app.entities', {
					url: '/entities/',
					templateUrl: 'views/entities.html',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load('scripts/controllers/entities.js');
						}]
					},
					data: {
						title: '엔티티 모니터링',
					}
				})
				.state('app.entitiesDetail', {
					url: '/entities/:entityId',
					templateUrl: 'views/entities_detail.html',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load('scripts/controllers/entities_detail.js');
						}]
					},
					data: {
						title: '엔티티 모니터링',
					}
				})
				.state('app.events', {
					url: '/events/',
					templateUrl: 'views/events.html',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load('scripts/controllers/events.js');
						}]
					},
					data: {
						title: '이벤트 모니터링',
					}
				})
				.state('app.eventsDetail', {
					url: '/events/:eventId',
					templateUrl: 'views/events_detail.html',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load('scripts/controllers/events_detail.js');
						}]
					},
					data: {
						title: '이벤트 모니터링',
					}
				})

				.state('app.instances', {
					url: '/instances/',
					templateUrl: 'views/instances.html',
					data: {
						title: '인스턴스 모니터링',
					}
				})
		}

	])
	.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
			debug: false,
			events: false
		});
	}])
	.config(['$httpProvider', function ($httpProvider) {
		//$httpProvider.defaults.useXDomain = true;
		//delete $httpProvider.defaults.headers.common['X-Requested-With'];
		//$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	}]);
