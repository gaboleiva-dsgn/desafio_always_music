-- Creamos la base de datos
CREATE DATABASE dbalwaysmusic;

-- Creamos la tabla alumnos
CREATE TABLE alumnos (
    nombre VARCHAR(30) NOT NULL,
    rut VARCHAR(30) PRIMARY KEY,
    curso VARCHAR(30) NOT NULL,
    nivel VARCHAR(30) NOT NULL
    );