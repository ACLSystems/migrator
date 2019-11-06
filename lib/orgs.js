const axios = require('./request');
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

// var verbose = colors.verbose;
// var warn = colors.warn;

const serverA = process.env.SERVER_ORIGIN;
const tokenA = process.env.ADMIN_TOKEN_ORIGIN;
const serverB = process.env.SERVER_DEST;
const tokenB = process.env.ADMIN_TOKEN_DEST;

module.exports = {
	async get(org) {
		var options = {
			method: 'get',
			url:  `${serverA}/api/v1/admin/org/get`,
			params:{
				name: org
			},
			headers: {
				'x-access-token': tokenA
			},
		};
		const response = await axios.getResponse(options);
		return response;
	}, // get

	async create(org) {
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/admin/org/create`,
			data:{
				name: org.name,
				longName: org.title,
				alias: org.type,
				isActive: org.level
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	} // create
};
