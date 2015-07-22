(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('tupeCtrl', tupeCtrl);
		tupeCtrl.$inject = ['$http', 'mainViewFactory', '$scope', 'chatSocket'];

		function tupeCtrl($http, mainFac, $scope, chatSocket) {
			var vm = this;
			vm.links = '';
			vm.small_img = '';
			vm.big_img = '';
			vm.video_name = '';
			vm.getSize = getSize;
			vm.download = download;
			vm.sendSocket = sendSocket;


			function getSize() {
				var url = mainFac.api_url + "app/tupe",
					data = {
						"url": vm.url
					};
				$http.post(url, data)
					.success(function (res) {
						vm.links = res;
						vm.small_img = vm.links[1];
						vm.big_img = vm.links[2];
						vm.video_name = vm.links[3];
						vm.links = vm.links[0];
						console.log('22222222', vm.links);
					}).error(function (err) {
						console.log('error is', err);
						vm.links = err;
					});
			}

			function download(inp) {
				console.log('download', inp);
			}

			function sendSocket() {
				chatSocket.emit('message', 'salam', 'from akbar');
			}
		}
	});
}());