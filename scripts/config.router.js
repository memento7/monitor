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
									insertBefore: '#load_styles_before',
									files: [
										'styles/climacons-font.css',
										'vendor/rickshaw/rickshaw.min.css'
									]
								},
								{
									serie: true,
									files: [
										'vendor/d3/d3.min.js',
										'vendor/rickshaw/rickshaw.min.js',
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
							return $ocLazyLoad.load([
								{
									insertBefore: '#load_styles_before',
									files: [
										'vendor/rickshaw/rickshaw.min.css'
									]
								},
								{
									serie: true,
									files: [
										'vendor/d3/d3.min.js',
										'vendor/rickshaw/rickshaw.min.js',
									]
								}
							]).then(function () {
								return $ocLazyLoad.load('scripts/controllers/entities.js');
							});
						}]
					},
					data: {
						title: '엔티티 모니터링',
					}
				})

				.state('app.events', {
					url: '/events/',
					templateUrl: 'views/events.html',
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
	}]);
