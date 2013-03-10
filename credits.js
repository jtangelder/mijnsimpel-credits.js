var fs = require('fs');

var cache_file = 'var/simpel_data.json';


exports.getCredentials = function() {
    return JSON.parse(fs.readFileSync('var/credentials.json'));
};


exports.getCredits = function(callback) {
	function returnData() {
		var data = fs.readFileSync(cache_file);
        callback(JSON.parse(data));
	}

	// cache file does not exists
	if(!fs.existsSync(cache_file)) {
		exports.refreshCredits(function() {
			returnData();
		});
	}
	else {
		returnData();
	}
};


exports.refreshCredits = function(callback) {
	var exec = require('child_process').exec,
		child = exec('casperjs scripts/get_credits.js',
		function (error, data) {
			// log errors
			if (error !== null) {
				console.log('exec error: ' + error);
			}

			// save output in json file
			else {
                data = JSON.parse(data);

				fs.writeFile(cache_file, JSON.stringify({
					date: new Date(),
                    data: data
				}), function(err) {
					callback({
                        data: data,
						error: error || err
					});
				});
			}
		});
};


exports.authenticate = function(username, password) {
    // get the sign in credentials
    var credentials = exports.getCredentials();
    return (username === credentials.username &&
            password === credentials.password);
};