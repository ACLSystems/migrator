const axios = require('axios');

module.exports = {
	async getResponse(options) {
		try {
			let response = await axios(options);
			return response;
		} catch (err) {
			console.log(options);
			console.log('Error!!!');//eslint-disable-line
			if(err.response) {
				console.log(err.response.status);//eslint-disable-line
				console.log(err.response.data);//eslint-disable-line
				return err.response;
			} else {
				console.log(err);//eslint-disable-line
				process.exit(0);
			}
		}
	}
};
