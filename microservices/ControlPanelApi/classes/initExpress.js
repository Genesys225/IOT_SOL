
function setupExpress() {
	console.log(123);
	const express = require('express');
	const bodyParser = require('body-parser');
	const cors = require('cors');
	const app = express();
	const port = 6000;

	// Where we will keep books
	let books = [];

	app.use(cors());

	// Configuring body parser middleware
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.post('/book', (req, res) => {
		// We will be coding here
	});
	app.post('/book', (req, res) => {
		// We will be coding here
	});

	app.listen(port, () =>
		console.log(`Hello world app listening on port ${port}!`)
	);
	return app;
}

module.exports = setupExpress;