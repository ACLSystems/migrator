const colors = require('colors');
const cmd = process.argv[2];
console.log(`command: ${cmd}`);

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
var warn = colors.warn;
var info = colors.info;
var data = colors.data;
var verbose = colors.verbose;

async function migrateCourse(courseCode) {
	/*
		* Obtener curso
		*/
	const c = require('./lib/course');
	const course = await c.get(courseCode);
	if(course.status === 200){
		console.log(verbose('Curso ') + warn(course.data.course.title) + verbose(' obtenido de origen'));
		const newCourse = await c.create(course.data.course);
		var courseId;
		if(newCourse && newCourse.status === 201) {
			courseId = newCourse.data.id;
			console.log(info('Curso ') + verbose(courseCode) + info(' creado en Destino correctamente con id ') + verbose(courseId));
			console.log(data('Respuesta creación curso ') + verbose(courseCode) + data(':'));
			console.log(newCourse.data);
		} else if(newCourse.status === 406
			& newCourse.data.message === 'Error 1447: course -' + courseCode + '- already exists') {
			courseId = newCourse.data.id;
			console.log(warn('Curso ') + verbose(courseCode) + warn(' ya existe en Destino con id ') + verbose(courseId));
			process.exit(0);
		}
		/*
		* Ahora obtener y generar los bloques
		*/
		if(courseId) {
			var response;
			var section;
			var number;
			//console.log(course.data.course.blocks);
			if(course.data.course.blocks && Array.isArray(course.data.course.blocks) && course.data.course.blocks.length > 0) {
				let blocks = course.data.course.blocks;
				let blockNum = blocks.length;
				console.log(verbose('Generando ') + warn(blockNum) + verbose(' bloques para ') + warn(courseCode));
				for(var i=0; i< blockNum; i++) {
					/* Obtener bloque */
					response = await c.getBlock(blocks[i]);
					if(response.data.status === 200){
						let block = response.data.message;
						section = block.blockSection;
						number = block.blockNumber;
						/* Creamos el bloque */
						console.log(verbose('Creando bloque ')+ warn((i+1)+'/'+blockNum) + verbose(' -----------------------------------'));
						response = await c.createBlock(courseCode,block);
						console.log(data('Respuesta bloque ') + warn(i+1) + data(':'));
						console.log(response.data);
						const newBlockId = response.data.id;
						if(response.status === 200) {
							if(block.blockType === 'questionnarie' &&
							block.questionnarie && block.questionnarie.qstnnId) {
								/*
									* Vemos si hay cuestionario
									* y lo creamos
								*/
								console.log(verbose('Generando cuestionario'));
								response = await c.createQuestionnarie(newBlockId,block);
								console.log(data('Respuesta cuestionario para bloque ') + warn(i+1)+ data(':'));
								console.log(response.data);
							}
							if(block.blockType === 'task' &&
							block.task && block.task.taskId) {
								/*
									* Vemos si hay tarea
									* y la creamos
								*/
								console.log(verbose('Generando tarea'));
								response = await c.createTasks(newBlockId,block);
								console.log(data('Respuesta tarea para bloque ') + warn(i+1)+ data(':'));
								console.log(response.data);
								console.log(verbose('Tarea -----------------'));
							}
							/*
							* Modificamos bloque para
							* agregarle información adicional
							*/
							console.log(verbose('Modificando bloque ') + warn(i+1));
							response = await c.modifyBlock(newBlockId,block);
							console.log(data('Respuesta modificación bloque ') + warn(i+1)+ data(':'));
							console.log(response.data);
							if(response.status === 200) {
								console.log(info('Bloque ') + warn(i+1) + info(' modificado'));
							}
						} else {
							console.log(error('Hubo un problema con el bloque '));
						}
					} else {
						console.log(error(`No encontramos bloque con id ${blocks[i]}`));
					}
				}
				/*
					* Vemos si hay recursos disponibles
					* y los creamos
				*/
				console.log(verbose('Localizando recursos'));
				response = await c.getResources(courseCode);
				if(response.data.message
					&& Array.isArray(response.data.message) &&
					response.data.message.length > 0
				) {
					let resources = response.data.message;
					if(resources.length === 1) {
						console.log(verbose('Creando un recurso'));
					} else {
						console.log(verbose('Creando ') + warn(resources.length) + verbose(' recursos'));
					}
					for(i=0; i < resources.length; i++) {
						console.log(verbose('Generando recurso ') + warn((i+1)+'/'+resources.length) + verbose(' ------------------'));
						response = await c.createResource(
							courseCode,
							resources[i].title,
							resources[i].content,
							resources[i].embedded,
							resources[i].status,
							resources[i].isVisible
						);
						console.log(data('Respuesta creacion de recurso ') + warn(i+1) + data(':'));
						console.log(response.data);
						if(response.status === 200 || response.status === 201) {
							console.log(info('Recurso ') + warn(i+1) + info(' creado'));
						} else {
							console.log(error(`Hubo un problema al crear el recurso ${i + 1}`));
						}
					}
				} else {
					console.log(warn('No hay recursos para crear'));
				}
				response = await c.setNextSection(courseCode,section,number);
				if(response.status === 200) {
					/*
					* Por último, activamos curso
					*/
					console.log(verbose('Activando curso ----------------------------------------------------'));
					response = await c.activate(courseCode);
					console.log(response.data);
					if(response.status === 200) {
						console.log(info('Curso ') + warn(courseCode) + info(' migrado y activado'));
					}
				}
			}
		}
	} else {
		//console.log(warn(course.data));
		console.log(error(`Curso ${courseCode} no existe en origen o hubo un error al tratar de obtenerlo`));
	}
}

async function migrateOrgUnits(org,query) {
	const OrgUnits = require('./lib/orgUnits');
	const response = await OrgUnits.get(org,query);
	if(response.data && response.data.message) {
		var ous = response.data.message.ous;
		if(ous && Array.isArray(ous) && ous.length > 0) {
			for(var i=0; i < ous.length; i++) {
				await OrgUnits.create(ous[i]);
				console.log(`${ous[i].name} creado`);
			}
		} else {
			console.log(warn('La consulta no trajo resultados'));
		}
	} else {
		console.log(response);
	}
}

if(!cmd) {
	console.log(warn('Por favor ingrese el comando y el curso a migrar'));
	process.exit(0);
}

if(cmd === 'course') {
	console.log(`Migrar curso con clave ${process.argv[3]}`);
	migrateCourse(process.argv[3]);
} else if(cmd === 'org') {
	// migrateOrg(process.argv[3]);
	console.log('org');
} else if(cmd === 'orgUnits') {
	let query = JSON.stringify({ parent: process.argv[4]});
	migrateOrgUnits(process.argv[3], query);
}
