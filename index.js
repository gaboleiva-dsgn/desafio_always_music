const { log } = require("console");
const { Pool } = require("pg");

const config = {
  user: "gaboleiva",
  host: "localhost",
  password: "P455p0r7",
  database: "dbalwaysmusic",
  port: 5432
};

const pool = new Pool(config);

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

// Función asincrona para crear un nuevo alumno.
const nuevoAlumno =  async ({ nombre, rut, curso, nivel }) => {
try {
if (!nombre || !rut || !curso || !nivel) {
    console.log("No se pudo agregar el alumno.");
    console.log("Debe ingresar nombre, rut, curso y nivel");
} 
else {
    const res = await pool.query(
        "INSERT INTO alumnos values ($1, $2, $3, $4) RETURNING *",
    [nombre, rut, curso, nivel]
    );
    console.log(`Alumno ${nombre} del curso ${curso} agregado con éxito:`, res.rows[0]);
}
    } catch (error) {
        console.log("Mensaje de error: ", error)
    }
};

// Función asincrona para consultar un alumno pasando como parametro el rut.
const consultaRut = async ( rut ) => {
    try {
        const res = await pool.query(
            "SELECT * FROM alumnos WHERE rut = $1", 
            [rut]
        );
        if (!rut) {
            console.log("Debe ingresar un rut para consultar");
        }else if (res.rows == 0) {
            console.log(`El rut ${rut} ingresado no existe`);
        } else {
            console.log(`Alumno con rut ${rut}: `, res.rows[0]);
        }
    } catch (error) {
        console.log("Mensaje de error: ", error);
    }
};

// Función asincrona para consultar la lista completa de los alumnos.
const totalAlumnos = async () => {
    try {
        const res = await pool.query(`SELECT * FROM alumnos`);
        console.log("Alumnos registrados:", res.rows);
    } catch (error) {
        console.log("Mensaje de error: ", error)
    }
  };

// Función asincrona para eliminar Alumno pasandole como parametro el rut 
  const eliminarAlumno = async (rut) => {
      try {
        const res = await pool.query(
          `DELETE FROM alumnos WHERE rut = $1 RETURNING *`,
          [rut]
        );
        if (!rut) {
            console.log("Debe ingresar un rut");
        } else if (res.rows == 0) {
            console.log(`El alumno con ${rut} no existe`);
        }
        else {
            console.log(`El alumno con ${rut} eliminado con éxito`);
            console.log("Alumno eliminado: ", res.rows[0]);
        }
    } catch (error) {
        console.log(`El alumno con ${rut} no existe`);
    }
};

  // Funcion IIFE que recibe de la linea de comando y llama funciones asincronas internas
(async () => {
    // recibir funciones y campos de la linea de comando
    switch (funcion) {
      case 'agregar':
        nuevoAlumno({ nombre, rut, curso, nivel })
        break;
      case 'rut':
        consultaRut(argumentos[1])
        break;
      case 'todos':
        totalAlumnos()
        break;
      case 'editar':
        nuevoAlumno({ nombre, rut, curso, nivel })
        break;
      case 'eliminar':
        eliminarAlumno(argumentos[1])
        break;
      default:
        console.log("Funcion: " + funcion + "no es valida")
        break;
    }
    
    pool.end()
  })()