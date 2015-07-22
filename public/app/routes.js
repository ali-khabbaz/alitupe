define(['app'], function (app) {
	return {
		defaultRoutePath: '/main',
		routes: {
			'/main': {
				templateUrl: '/app/main/main.html'
			},
			'/page1': {
				templateUrl: '/app/page1/page1.html',
				dependencies: [
					'/app/page1/page1Ctrl.js'
				]
			},
			'/register': {
				templateUrl: '/app/register/register.html',
				dependencies: [
					'/app/register/registerCtrl.js',
					'/app/register/registerDirective.js'
				]
			},
			'/login': {
				templateUrl: '/app/login/login.html',
				dependencies: [
					'/app/login/loginCtrl.js'
				]
			},
			'/jobs': {
				templateUrl: '/app/jobs/jobs.html',
				dependencies: [
					'/app/jobs/jobsCtrl.js'
				]
			},
			'/tupe': {
				templateUrl: '/app/tupe/tupe.html',
				dependencies: [
					'/app/tupe/tupeCtrl.js'
				]
			}
		}
	};
});