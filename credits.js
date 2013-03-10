var fs = require('fs');

var cache_file = 'var/simpel_data.json',
	cache_time = (30 * 60); // 30 minutes

exports.getCredits = function(callback) {
	function returnData() {
		var data = fs.readFileSync(cache_file);
        callback(JSON.parse(data));
	}

	// cache file does not exists
	var exists = fs.existsSync(cache_file);
    var time_in_cache = 0;

    if(exists) {
		var stats = fs.statSync(cache_file);
		time_in_cache = Math.round((new Date() - stats.mtime) / 1000);
    }

	if(!exists || time_in_cache > cache_time) {
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
    var credentials = JSON.parse(fs.readFileSync('var/credentials.json'));
    return (username == credentials.username && password == credentials.password);
};