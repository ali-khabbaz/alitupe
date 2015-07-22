require.config({
	waitSeconds: 0,
	baseUrl: '/app/',
	paths: {
		'app': 'app',
		'angular': '../vendor/angular/angular.min',
		'angular-route': '../vendor/angular-route/angular-route.min',
		'jquery': '../vendor/jquery/dist/jquery.min',
		'angular-resource': '../vendor/angular-resource/angular-resource.min',
		'MainViewCtrl': 'main/MainViewCtrl',
		'mainViewFactory': 'main/mainViewFactory',
		'authInterceptor': 'main/authInterceptor',
		'angular-socket': '../vendor/socket',
		'socket': '../vendor/socket.io-1.3.5',
		'satellizer': '../vendor/satellizer'
	},
	shim: {
		'app': {
			deps: ['angular-route', 'angular-resource', 'satellizer', 'angular-socket', 'socket']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-resource': {
			deps: ['angular']
		},
		'satellizer': {
			deps: ['angular']
		},
		'angular-socket': {
			deps: ['angular', 'socket']
		}

	}
});
requirejs.onError = function (err) {
	console.error('[require error] type: ', err.requireType, ' ,modules: ' + err.requireModules);
	throw err;
};
require(['app'], function () {
	require(['MainViewCtrl', 'mainViewFactory', 'authInterceptor'], function () {
		angular.bootstrap(document, ['app']);
	});
});