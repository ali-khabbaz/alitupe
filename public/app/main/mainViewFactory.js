define(['app'], function (app) {
	app.factory('mainViewFactory', mainViewFactory);
	mainViewFactory.$inject = ['$window'];

	function mainViewFactory($window) {
		var factory = {
				getToken: getToken,
				setToken: setToken,
				getUser: getUser,
				setUser: setUser,
				isAuthenticated: isAuthenticated,
				removeToken: removeToken,
				request: request,
				response: response,
				remoteLogin: remoteLogin,
				api_url: "http://localhost/"
			},
			storage = $window.localStorage,
			cached_token;
		return factory;

		function setToken(token) {
			cached_token = token;
			storage.setItem('userToken', token);
		}

		function getToken() {
			if (!cached_token) {
				cached_token = storage.getItem('userToken');
			}
			return cached_token;
		}

		function isAuthenticated() {
			return !!getToken();
		}

		function setUser(user) {
			if (isAuthenticated()) {
				storage.setItem('userInfo', user);
			}
		}

		function getUser() {
			return storage.getItem('userInfo');
		}

		function removeToken() {
			cached_token = null;
			storage.removeItem('userToken');
			storage.removeItem('userInfo');
		}

		function request(config) {
			var token = getToken();
			if (token) {
				config.headers.authorization = 'ali is just' + token;
			}
			return config;
		}

		function response(res) {
			return res;
		}

		function remoteLogin(provider) {

		}
	}

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('mainViewFactory');
	}]);
});