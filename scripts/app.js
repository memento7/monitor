'use strict';

/**
 * @ngdoc overview
 * @name urbanApp
 * @description
 * # urbanApp
 *
 * Main module of the application.
 */
var app = angular
	.module('urbanApp', [
		'ui.router',
		'ngAnimate',
		'ui.bootstrap',
		'oc.lazyLoad',
		'ngStorage',
		'ngSanitize',
		'ui.utils',
		'ngTouch'

	])
	.constant('COLORS', {
		'default': '#e2e2e2',
		primary: '#09c',
		success: '#2ECC71',
		warning: '#ffc65d',
		danger: '#d96557',
		info: '#4cc3d9',
		white: 'white',
		dark: '#4C5064',
		border: '#e4e4e4',
		bodyBg: '#e0e8f2',
		textColor: '#6B6B6B',
	});
/*
, function ($routeProvider, $locationProvider, $httpProvider) {
		var interceptor = function() {
			return {
				'request': function(config) {
					config.headers['Authorization'] = security.BASIC_AUTH_KEY;
				}
			}
		};

		$httpProvider.responseInterceptors.push(interceptor);
	}
*/


var API_BASE = 'https://manage.memento.live/api';
var JOBAPI_BASE = 'https://manage.memento.live:7443/api';
var ES_BASE = 'https://es.memento.live';

$.ajaxSetup({
	beforeSend: function (xhr, settings) {
		//xhr.setRequestHeader("Accept","application/vvv.website+json;version=1");
		if (settings.url.indexOf(API_BASE) == 0)
			xhr.setRequestHeader("Authorization", 'Basic ' + security.BASIC_AUTH_KEY);
		else if (settings.url.indexOf(JOBAPI_BASE) == 0) {
			xhr.setRequestHeader("Authorization", 'Basic ' + security.BASIC_AUTH_KEY);
		}
		else if (settings.url.indexOf(ES_BASE) == 0) {
			xhr.setRequestHeader("Authorization", 'Basic ' + security.ES_BASIC_AUTH_KEY);
			xhr.withCredentials = true;
		}
	}
});
