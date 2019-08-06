const axios = require('./request');

const serverA = process.env.SERVER_ORIGIN;
const tokenA = process.env.ADMIN_TOKEN_ORIGIN;
const serverB = process.env.SERVER_DEST;
const tokenB = process.env.ADMIN_TOKEN_DEST;

module.exports = {
	async get(courseCode) {
		var options = {
			method: 'get',
			url:  `${serverA}/api/v1/admin/export/course`,
			params:{
				code: courseCode
			},
			headers: {
				'x-access-token': tokenA
			},
		};
		const response = await axios.getResponse(options);
		return response;
	}, // get

	async create(course) {
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/author/course/create`,
			data:{
				code: course.code,
				title: course.title,
				type: course.type,
				level: course.level,
				categories: course.categories,
				keywords: course.keywords,
				description: course.description,
				image: course.image,
				details: course.details,
				author: course.author,
				price: course.price,
				cost: course.cost
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //create

	async getBlock(id) {
		var options = {
			method: 'get',
			url:  `${serverA}/api/v1/author/course/getblock`,
			params:{
				id: id
			},
			headers: {
				'x-access-token': tokenA
			},
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, // getBlock

	async createBlock(courseCode, block) {
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/author/course/createblock`,
			data:{
				coursecode: courseCode,
				code: block.blockCode,
				type: block.blockType,
				title: block.blockTitle,
				section: block.blockSection,
				number: block.blockNumber,
				order: block.blockOrder,
				content: block.blockContent,
				media: block.blockMedia,
				w: block.blockW,
				wq: block.blockWq,
				wt: block.blockWt,
				duration: block.blockDuration,
				durationUnits: block.blockDurationUnits,
				begin: block.blockBegin,
				defaultmin: block.blockDefaultmin
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //createBlock

	async modifyBlock(id, block) {
		var options = {
			method: 'put',
			url:  `${serverB}/api/v1/author/course/modifyblock`,
			data:{
				id: id,
				block: {
					section: block.blockSection,
					number: block.blockNumber,
					order: block.blockOrder,
					w: block.blockW,
					wq: block.blockWq,
					wt: block.blockWt
				}
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //modifyBlock

	async setNextSection(courseCode,section,number) {
		var options = {
			method: 'put',
			url:  `${serverB}/api/v1/author/course/setnextsection`,
			data:{
				coursecode: courseCode,
				section: section,
				number: number
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //modifyBlock

	async createQuestionnarie(id,block) {
		let questionnarie = block.questionnarie;
		var questions = [];
		if(questionnarie.questions &&
			Array.isArray(questionnarie.questions) &&
			questionnarie.questions.length > 0 ) {
			let qs = questionnarie.questions;
			qs.forEach(q => {
				let newQ = {};
				if(q.questHeader)		{newQ.header 	= q.questHeader;}
				if(q.questType) 		{newQ.type 		= q.questType;}
				if(q.questLabel) 		{newQ.label 	= q.questLabel;}
				if(q.questText) 		{newQ.text		= q.questText;}
				if(q.questW) 				{newQ.w				= q.questW;}
				if(q.questIsVisible){newQ.isVisible	= q.questIsVisible;}
				if(q.questFooter) 	{newQ.footer	= q.questFooter;}
				if(q.answers &&
					Array.isArray(q.answers) &&
					q.answers.length > 0) {
					let newAns = [];
					q.answers.forEach(a => {
						let ans = {
							type: a.ansType,
						};
						if(a.ansType === 'index') {
							ans.index	= a.ansIndex;
						}
						if(a.ansType === 'text') {
							ans.text	= a.ansText;
						}
						if(a.ansType === 'tf') {
							ans.tf		= a.ansTf;
						}
						if(a.ansType === 'group') {
							ans.group	= a.ansGroup;
						}
						newAns.push(ans);
					});
					newQ.answers = newAns;
				}
				if(q.options &&
					Array.isArray(q.options) &&
					q.options.length > 0) {
					let newOpts = [];
					q.options.forEach(o => {
						newOpts.push({
							name	: o.optName,
							value : o.optValue
						});
					});
					newQ.options = newOpts;
				}
				questions.push(newQ);
			});
		}
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/author/course/createquestionnarie`,
			data:{
				id: id,
				questionnarie: {
					isVisible: questionnarie.qstnnIsVisible,
					keywords: questionnarie.qstnnKeywords,
					maxAttempts: questionnarie.qstnnMaxAttempts,
					type: questionnarie.qstnnType,
					questions: questions
				}
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //createQuestionnarie

	async createTasks(id,block) {
		let task = block.task;
		var items = [];

		if(task.items &&
			Array.isArray(task.items) &&
			task.items.length > 0
		) {
			task.items.forEach(item => {
				items.push({
					label: item.itemLabel,
					type: item.itemType,
					text: item.itemText,
					files: item.itemFiles,
					header: item.itemHeader,
					footer:	item.itemFooter,
					w: item.itemW
				});
			});
		}
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/author/course/createtasks`,
			data:{
				id: id,
				justDelivery: task.taskJustDelivery,
				tasks: items
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		const response = await axios.getResponse(options);
		return response;
	}, //createTasks

	async getResources(courseCode) {
		var options = {
			method: 'get',
			url:  `${serverA}/api/v1/author/course/getresource`,
			params:{
				code: courseCode
			},
			headers: {
				'x-access-token': tokenA
			},
		};
		const response = await axios.getResponse(options);
		return response;
	}, // get

	async createResource(courseCode,
		title,
		content,
		embedded,
		status,
		isVisible
	) {
		var options = {
			method: 'post',
			url:  `${serverB}/api/v1/author/course/createresource`,
			data:{
				coursecode: courseCode,
				title: title,
				content: content,
				embedded: embedded,
				status: status,
				isVisible: isVisible
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //createResource

	async activate(courseCode) {
		var options = {
			method: 'put',
			url:  `${serverB}/api/v1/author/course/makeavailable`,
			data:{
				code: courseCode
			},
			headers: {
				'x-access-token': tokenB,
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		const response = await axios.getResponse(options);
		return response;
	}, //activate

};
