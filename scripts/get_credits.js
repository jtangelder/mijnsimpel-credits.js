var casper = require('casper').create(),
    fs = require('fs');

var source_url = 'https://www.mijnsimpel.nl/login.aspx?ReturnUrl=Credit.aspx',
    credits = [];
    credentials = JSON.parse(fs.read('scripts/credentials.json'));

casper.start(source_url, function() {
	this.fill('form', {
		'ctl00$content$txtLoginName': credentials.username,
		'ctl00$content$txtPassword': credentials.password
	});

	this.click('#ctl00_content_lbSubmit');
});

casper.then(function() {
    credits = this.evaluate(function() {
        var data = [],
            table = document.querySelector("#content table"),
            row, r;

        for(r=0; r<table.rows.length; r++) {
            row = table.rows[r];
            data.push({
                label: row.cells[0].innerText,
                value: row.cells[1].innerText
            });
        }
		return data;
	});
});

casper.run(function() {
	this.echo(JSON.stringify(credits));
	this.exit();
});