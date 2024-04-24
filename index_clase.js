const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "1234",
  database: "empresa",
  port: 5432
};

const pool = new Pool(config);

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const id = argumentos[1];
const name = argumentos[2];
const lastname = argumentos[3];

console.log("****************************");
console.log("Funcion: " + funcion);
console.log("Id: " + id);
console.log("Name: " + name);
console.log("Lastname: " + lastname);
console.log("****************************");

const getUsuario = async () => {
  const res = await pool.query("SELECT * FROM usuarios");
  console.log("Usuarios registrados:", res.rows);
}

const consultaId = async ({ id }) => {
  const res = await pool.query(
    `SELECT * FROM usuarios WHERE id='${id}'`
  );
  console.log("Usuario consultado: ", res.rows[0]);
}

const nuevoUsuario = async ({ id, name, lastname }) => {
  const res  = await pool.query(
    `INSERT INTO usuarios values ('${id}','${name}', '${lastname}') RETURNING *`
  );
  console.log(`Usuario ${name} ${lastname} agregado con éxito`);
  console.log("Usuario Agregado: ", res.rows[0]);
}


// Funcion IIFE que recibe de la linea de comando y llama funciones asincronas internas
(async () => {
  // recibir funciones y campos de la linea de comando
  switch (funcion) {
    case 'agregar':
      nuevoUsuario({ id, name, lastname })
      break;
    case 'id':
      consultaId({ id })
      break;
    case 'todos':
      getUsuario()
      break;
    default:
      console.log("Funcion: " + funcion + "no es valida")
      break;
  }
  
  pool.end()
})()

// instrucciones de uso;
// consultar todos:  node index todos
// consultar por id: node index id 4444
// ingresar datos: node index agregar 7878 Loco Barrios