
async function reviewCourse(courseCode) {
	const c = require('./lib/course');
	const course = await c.get(courseCode);
	if(course.status === 200){
		if(course.data.course.blocks && Array.isArray(course.data.course.blocks) && course.data.course.blocks.length > 0) {
			let blocks = course.data.course.blocks;
			var found = false;
			let ind = 1;
			var regex = new RegExp(process.argv[3],'i');
			if(regex.test(course.data.course.description)) {
				console.log(`curso ${course.data.course.code} tiene la palabra ${process.argv[3]} en la descripción`);
				found = true;
			}
			if(blocks.length > 10){
				ind = 2;
			}
			if(blocks.length > 100){
				ind = 3;
			}
			for(var i=0; i< blocks.length; i++) {
				/* Obtener bloque */
				var response = await c.getBlock(blocks[i]);
				if(response.data.status === 200){
					let block = response.data.message;
					let str = '' + (i + 1);
					console.log(`${str.padStart(ind,'0')}/${blocks.length} Checando bloque ${block.blockId}`);
					let content = block.content;
					if(regex.test(content)) {
						console.log(`Bloque ${block._id} tiene la palabra ${process.argv[3]} en el contenido`);
						found = true;
					}
				}
			}
			if(!found) {
				console.log(`No se encontraron registros de '${process.argv[3]}'`);
			}
		} else {
			console.log(`Curso ${courseCode} no tiene bloques`);
		}
	} else {
		console.log(course.data);
		console.log(`Curso ${courseCode} no existe o hubo un error al tratar de obtenerlo`);
	}
}

if(!process.argv[2]) {
	console.log('Falta el código de curso para comenzar');
	process.exit(0);
}
if(!process.argv[3]) {
	console.log('Falta la palabra a buscar para comenzar');
	process.exit(0);
}
reviewCourse(process.argv[2]);
