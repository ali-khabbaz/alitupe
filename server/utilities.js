(function () {
	var q = require('./requires.js').q,
		bcrypt = require('./requires.js').bcrypt,
		crypto = require('./requires.js').crypto,
		jwt = require('./requires.js').jwt,
		file_size = require('./requires.js').file_size,
		fs = require('./requires.js').fs,
		ytdl = require('./requires.js').ytdl,
		c = require('./requires.js').c;

	function showDb(myquery) {
		var dfd = q.defer(),
			res_result = [];
		c.on('connect', function () {}).on('error', function (err) {
			return dfd.reject(new Error(err));
		}).on('close', function () {});
		c.query(myquery)
			.on('result', function (res) {
				res
					.on('row', function (row) {
						res_result.push(row);
					})
					.on('error', function (err) {
						dfd.reject(new Error(err));
					})
					.on('end', function () {});
			})
			.on('end', function () {
				dfd.resolve(res_result);
			});
		return dfd.promise;
	}

	function encryptor(str) {
		console.log('str is', str);
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return err;
			}
			bcrypt.hash(str, salt, null, function (err, hash) {
				if (err) {
					return err;
				}
				console.log('str is', hash);
				return hash;
			});
		});
	}

	function encryptor2(str) {
		var algorithm = 'aes-256-gcm',
			password = str,
			cipher = crypto.createCipher(algorithm, password),
			crypted = cipher.update(str, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	}

	function encode(payload, secret) {
		var algorithm = 'HS256',
			header = {
				typ: 'JWT',
				alg: algorithm
			},
			jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
		return jwt + '.' + sign(jwt, secret);
	}

	function decode(token, secret) {
		var segments = token.split('.');
		if (segments.length !== 3) {
			throw new Error('token structure incorrect');
		}

		var raw_signature = segments[0] + '.' + segments[1];

		if (!verify(raw_signature, "shh...", segments[2])) {
			throw new Error('verification failed');
		}
		var header = JSON.parse(base64Decode(segments[0]));
		var payload = JSON.parse(base64Decode(segments[1]));
		return payload;
	}

	function base64Encode(str) {
		return Buffer(str).toString('base64');
	}

	function base64Decode(str) {
		return new Buffer(str, 'base64').toString();
	}

	function sign(str, key) {
		return crypto.createHmac('sha256', key).update(str).digest('base64');
	}

	function verify(raw, secret, signature) {
		return signature === sign(raw, secret);
	}

	function createToken(user, req) {
		var payload = {
			iss: req.hostname,
			sub: user.id
		};
		return jwt.encode(payload, "shh...");
	}

	function readFile(name_file) {
		var dfd = q.defer();
		fs.readFile(name_file, function (error, data) {
			if (error) {
				console.log('Error while reading from file!', error, name_file);
				return dfd.reject(new Error(error));
			} else {
				//console.log('got data for :', name_file);
				dfd.resolve(data);
			}
		}); //end read file
		return dfd.promise;
	}


	function getSize(link, thrds, final_file_name) {
		var options = {
				url: link,
				method: 'HEAD'
			},
			range = '',
			steps = [],
			length = '';

		function callback(error, res, body) {
			if (!error) {
				length = +res.caseless.dict['content-length'];
				var size = file_size(length, {
					base: 2
				});
				console.log('size', size);
				var range = parseInt(length / thrds);
				var funcs = [];
				for (var i = 0; i < thrds; i += 1) {
					steps.push([(range * i), ((range * (i + 1)) - 1)]);
					funcs.push(download(link, (range * i), ((range * (i + 1)) - 1), i, 'name'));
				}
				q.all(funcs).then(function (res_2) {

					funcs = [];
					res_2.sort(function (a, b) {
						return a[1] - b[1];
					});
					res_2.forEach(function (value) {
						funcs.push(readFile(value));
					});
					q.all(funcs).then(function (datas) {
						console.log('all_read');
						f = fs.createWriteStream(final_file_name);
						datas.forEach(function (value, index) {
							f.write(value);
						});

						res_2.forEach(function (value) {
							fs.unlink(value);
						});
						f.end();
						console.log('finished');
					});
					console.log('sorted', res_2);
				}).fail(function (err_2) {
					console.log('err', error);
				});
			} else {
				console.log('err', error);
			}
		}
		request(options, callback);
	}

	function download(link, start, end, ind, name) {
		var dfd = q.defer(),
			file_name = name + ind,
			f = fs.createWriteStream(file_name),
			options = {
				url: link,
				//method: 'GET',
				headers: {
					'User-Agent': 'request',
					'Range': 'bytes=' + start + '-' + end
				}
			},
			range = '',
			steps = [],
			str = '',
			length = '';

		function callback(error, res, body) {
			if (!error) {
				length = +res.caseless.dict['content-length'];
				var size = file_size(length, {
					base: 2
				});
				console.log('ind', ind, 'size', size);
				f.end();
				dfd.resolve(file_name);
			} else {
				console.log('err', error);
				download(link, start, end);
			}
		}
		request(options, callback).on('data', function (chunk) {
			str += chunk;
			f.write(chunk);
		});
		return dfd.promise;
	}

	function tupe(url) {
		var dfd = q.defer(),
			result = [];
		ytdl.getInfo(url,
			function (err, info) {
				if (err) {
					return dfd.reject(new Error(err));
				}
				var data = info.formats;
				data.forEach(function (value, index) {
					if (value.audioBitrate && value.resolution) {
						result.push({
							/*size: filesize(+value.clen, {
								base: 2
							}),*/
							url: value.url,
							format: value.container,
							resolution: value.resolution
						});
					}
				});
				dfd.resolve([result, info.thumbnail_url, info.iurlsd, info.title]);
			});
		return dfd.promise;
	}

	exports.showDb = showDb;
	exports.encryptor2 = encryptor2;
	exports.encode = encode;
	exports.decode = decode;
	exports.createToken = createToken;
	exports.tupe = tupe;
	exports.getSize = getSize;
}());