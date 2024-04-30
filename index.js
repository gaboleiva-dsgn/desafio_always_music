// const express = require("express");
// const app = express();
// const axios = require("axios");
// const fs = require("fs");
// const morgan = require("morgan");

const { Pool } = require("pg");

// app.use(express.json());
// app.use(morgan("dev"));

const manejoErrores = require("./manejoErrores.js")

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log("Servidor iniciado y escuchando en puerto: " + PORT));

const config = {
    user: "gaboleiva",
    host: "localhost",
    password: "",
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
const nuevoAlumno = async ({ nombre, rut, curso, nivel }) => {
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
        const { status, message } = manejoErrores(error.code || error);
        console.log(`Hubo un error: ${message}`);
        return { status, message };
    }
};

// Función asincrona para editar un alumno pasando el rut
const editarAlumno = async ({ nombre, rut, curso, nivel }) => {
    try {
        const res = await pool.query(
            `UPDATE alumnos SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE rut = $2 RETURNING *`, [nombre, rut, curso, nivel]
        );
        if (!nombre || !curso || !nivel) {
            console.log("Debe ingresar los campos nombre, rut, curso y nivel");
        } else if (res.rowCount == 0) {
            console.log(`El Alumno con rut ${rut} no existe`);
        }
        else {
            console.log(`El alumno con ${rut} fue editado con éxito`);
            console.log("El alumno editado: ", res.rows[0]);
        }
    } catch (error) {    
        const { status, message } = manejoErrores(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
    }
}
// Función asincrona para consultar un alumno pasando como parametro el rut.
const consultaRut = async (rut) => {
    try {
        console.log("Valor de rut: ", rut);
        const res = await pool.query(
            "SELECT * FROM alumnos WHERE rut = $1",
            [rut]
        );
        if (!rut) {
            console.log("Debe ingresar un rut para consultar");
        } else if (res.rowCount == 0) {
            console.log(`El rut ${rut} ingresado no existe`);
        } else {
            console.log(`Alumno con rut ${rut}: `, res.rows[0]);
        }
    } catch (error) {
        const { status, message } = manejoErrores(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
    }
};

// Función asincrona para consultar la lista completa de los alumnos.
const totalAlumnos = async () => {
    try {
        const res = await pool.query(`SELECT * FROM alumnos`);
        console.log("Alumnos registrados:", res.rows);
    } catch (error) {
        const { status, message } = manejoErrores(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
    }
};

// Función asincrona para eliminar Alumno pasandole como parametro el rut 
const eliminarAlumno = async ({rut}) => {
    try {
        const res = await pool.query(
            `DELETE FROM alumnos WHERE rut = $1 RETURNING *`,
            [rut]
        );
        if (!rut) {
            console.log("Debe ingresar un rut");
        } else if (res.rowCount == 0) {
            console.log(`El alumno con ${rut} no existe`);
        }
        else {
            console.log(`El alumno con ${rut} eliminado con éxito`);
            console.log("Alumno eliminado: ", res.rows[0]);
        }
    } catch (error) {
        // manejoErrores(error, pool, 'alumnos');

        const { status, message } = manejoErrores(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
    }
};

// Funcion IIFE que recibe de la linea de comando y llama funciones asincronas internas
(async () => {
    // recibir funciones y campos de la linea de comando
    switch (funcion) {
        case 'agregar':
            nuevoAlumno({ nombre, rut, curso, nivel })
            break;
        case 'editar':
            editarAlumno({ nombre, rut, curso, nivel })
            break;
            case 'rut':
            console.log("VAlor de rut: ", rut);
            consultaRut(rut)
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

// Comandos para probar por cosola
//
// Ingresar nuevo alumnos: 
// node index agregar Claudia 12.345.678-9 G-72 Experta
//
// Consultar todos:
// node index todos
//
// Consultar por rut:
// node index rut 12.345.678-9
//
// Editar alumno por rut:
// node index editar Gilia 12.345.678-9 E-70 Avanzada
//
// Eliminar alumno por rut:
// node index eliminar 12.345.678-9