const axios = require('axios');
const colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

var error = colors.red;
var help = colors.help;
var debug = colors.debug;

module.exports = {
	async getResponse(options) {
		try {
			let response = await axios(options);
			return response;
		} catch (err) {
			console.log(options);
			console.log(error('Error!!!'));//eslint-disable-line
			if(err.response) {
				console.log(debug(err.response.status));//eslint-disable-line
				console.log(help(err.response.data));//eslint-disable-line
				return err.response;
			} else {
				console.log(err);//eslint-disable-line
				process.exit(0);
			}
		}
	}
};
