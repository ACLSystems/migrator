const cmd = process.argv[2];

async function migrateCourse(courseCode) {
	/*
		* Obtener curso
		*/
	const c = require('./lib/course');
	const course = await c.get(courseCode);
	if(course.status === 200){
		console.log(`Curso ${courseCode} obtenido de origen`);
		const newCourse = await c.create(course.data.course);
		var courseId;
		if(newCourse && newCourse.status === 201) {
			courseId = newCourse.data.id;
			console.log(`Curso ${courseCode} creado en Destino correctamente con id ${courseId}`);
		} else if(newCourse.status === 406
			& newCourse.data.message === 'Error 1447: course -DP-101- already exists') {
			courseId = newCourse.data.id;
			console.log(`Curso ${courseCode} ya existe en Destino con id ${courseId}`);
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
				for(var i=0; i< blocks.length; i++) {
					/* Obtener bloque */
					response = await c.getBlock(blocks[i]);
					if(response.data.status === 200){
						let block = response.data.message;
						section = block.blockSection;
						number = block.blockNumber;
						/* Creamos el bloque */
						console.log(`Creando bloque ${i} -----------------------------------`);
						response = await c.createBlock(courseCode,block);
						console.log(`Respuesta bloque ${i}:`);
						console.log(response.data);
						const newBlockId = response.data.id;
						if(response.status === 200) {
							if(block.questionnarie && block.questionnarie.qstnnId) {
								/*
									* Vemos si hay cuestionario
									* y lo creamos
								*/
								console.log('Generando cuestionario');
								response = await c.createQuestionnarie(newBlockId,block);
								console.log(`Respuesta cuestionario para bloque ${i}:`);
								console.log(response.data);
							}
							/*
							* Modificamos bloque para
							* agregarle información adicional
							*/
							console.log(`Modificando bloque ${i}`);
							response = await c.modifyBlock(newBlockId,block);
							console.log(`Respuesta modificación bloque ${i}:`);
							console.log(response.data);
							if(response.status === 200) {
								console.log('Bloque modificado ------------------------------');
							}
						} else {
							console.log('Hubo un problema con el bloque ');
						}
					} else {
						console.log(`No encontramos bloque con id ${blocks[i]}`);
					}
				}
				response = await c.setNextSection(courseCode,section,number);
				if(response.status === 200) {
					/*
					* Por último, activamos curso
					*/
					console.log('Activando curso...');
					response = await c.activate(courseCode);
					console.log(response.data);
					if(response.status === 200) {
						console.log(`Curso ${courseCode} migrado y activado`);
					}
				}
			}
		}
	} else {
		console.log(course.data);
		console.log(`Curso ${courseCode} no existe en origen o hubo un error al tratar de obtenerlo`);
	}
}

if(cmd === 'course') {
	migrateCourse(process.argv[3]);
}
