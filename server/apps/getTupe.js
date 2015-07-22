(function () {

	var jwt = require('../requires.js').jwt,
		io = require('../../server.js').io,
		tupe = require('../utilities.js').tupe;

	function getTupe(req, res) {
		console.log('we are here');

		tupe(req.body.url).then(function (res_1) {
			//console.log('res_1', res_1);
			res.send(res_1);
		}).fail(function (err_1) {
			console.log('err_1', err_1);
		});
		/*if (!req.headers.authorization) {
			return res.status(401).send({
				message: 'you are not authorized'
			});
		}
		var token = '';
		if (req.headers.authorization.indexOf('ali is just.') !== -1) {
			token = req.headers.authorization.split('ali is just.')[1];
		} else if (req.headers.authorization.indexOf('ali is just') !== -1) {
			token = req.headers.authorization.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			return res.status(401).send({
				message: 'authentication failed'
			});
		}
		res.json({
			salam: "bahbah"
		});*/
	}

	exports.getTupe = getTupe;
}());