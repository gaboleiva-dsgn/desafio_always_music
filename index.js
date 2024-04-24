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

// Creamos un nuevo alumno
const nuevoAlumno =  async ({ nombre, rut, curso, nivel }) => {
try {
const res = await pool.query(
    "INSERT INTO alumnos values ($1, $2, $3, $4) RETURNING *",
[nombre, rut, curso, nivel]
);
console.log(`Alumno ${nombre} del ${curso} agregado con éxito`);
    } catch (error) {
        console.log("Mensaje de error: ", error)
    }
}

// Consultamos un alumno por rut
const consultaRut = async ( rut ) => {
    try {
        const res = await pool.query(
            `SELECT * FROM alumnos WHERE rut = $1`, 
            [rut]
        );
        console.log("Alumno consultado por rut: ", res.rows[0]);
    } catch (error) {
        console.log("Mensaje de error: ", error);
    }
};

const totalAlumnos = async () => {
    const res = await pool.query(`SELECT * FROM alumnos`);
    console.log("Alumnos registrados:", res.rows);
  };

  const eliminarAlumno = async (rut) => {
    const res = await pool.query(
      `DELETE FROM alumnos WHERE rut = $1 RETURNING *`,
      [rut]
    );
    console.log(`El alumno se ha eliminado con éxito`);
    console.log("Alumno eliminado: ", res.rows[0]);
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
        case 'eliminar':
        eliminarAlumno(argumentos[1])
        break;
      default:
        console.log("Funcion: " + funcion + "no es valida")
        break;
    }
    
    pool.end()
  })()