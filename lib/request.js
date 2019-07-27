const axios = require('axios');

module.exports = {
	async getResponse(options) {
		try {
			let response = await axios(options);
			return response;
		} catch (err) {
			//console.log('Error!!!');//eslint-disable-line
			//console.log(err.response.status);//eslint-disable-line
			//console.log(err.response.data);//eslint-disable-line
			return err.response;
		}
	}
};
