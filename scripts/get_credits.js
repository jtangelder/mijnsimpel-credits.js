var casper = require('casper').create(),
    fs = require('fs');

var source_url = 'https://www.mijnsimpel.nl/login.aspx?ReturnUrl=Credit.aspx',
    credits = [];
    // get the sign in credentials
    credentials = JSON.parse(fs.read('scripts/credentials.json'));


casper.start(source_url, function() {
    // sign in
	this.fill('form', {
		'ctl00$content$txtLoginName': credentials.username,
		'ctl00$content$txtPassword': credentials.password
	});

	this.click('#ctl00_content_lbSubmit');
});


casper.then(function() {
    credits = this.evaluate(function() {
        // simple formatting
        function formatLabel(label) {
            return label.replace("nog te gebruiken", "Resterende");
        }

        function formatValue(value) {
            return value.replace(' (uren/min/sec)', '');
        }

        // find the credits table and gather the data
        var data = [],
            table = document.querySelector("#content table"),
            row, r;

        for(r=0; r<table.rows.length; r++) {
            row = table.rows[r];
            data.push({
                label: formatLabel(row.cells[0].innerText),
                value: formatValue(row.cells[1].innerText)
            });
        }

		return data;
	});
});


casper.run(function() {
    // print the credits
	this.echo(JSON.stringify(credits));
	this.exit();
});