const express = require("express");
const users = express.Router();
const cnx = require("./MySql");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// configuracion del middleware para subir archivos al server
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "pe-" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: almacenamiento });

//insertar una persona : metodo post
users.post("/users/create", (req, res) => {
  let frmdata = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    posicion: req.body.posicion,
    correo: req.body.correo,
    password: bcrypt.hashSync(req.body.password, 10),
    foto: req.body.foto,
  };

  cnx.query("INSERT INTO usuario SET ?", frmdata, (error, data) => {
    try {
      res.status(200).send({
        status: "ok",
        mensaje: "Operación exitosa",
      });
    } catch (error) {
      console.log(error);

      res.status(404).send({
        status: "error",
        mensaje: "Error en la insercion !",
        error: error.message,
      });
    }
  });
});

users.put("/users/edit", (req, res) => {
  let frmdata = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    posicion: req.body.posicion,
    correo: req.body.correo,
    password: bcrypt.hashSync(req.body.password, 10),
    foto: req.body.foto,
  };
  const id = req.body.id;
  cnx.query("UPDATE FROM usuario SET ? WHERE id = ?", [frmdata, id], (error, data) => {
    try {
      res.status(200).send({
        status: "ok",
        mensaje: "Operación exitosa",
      });
    } catch (error) {
      console.log(error);

      res.status(404).send({
        status: "error",
        mensaje: "Error en la actualizacion !",
        error: error.message,
      });
    }
  });
});

users.delete("/users/delete/:id", (req, res) => {
  const id = req.params.id;
  cnx.query("DELETE usuario WHERE id = ?", id, (error, data) => {
    try {
      res.status(200).send({
        status: "ok",
        mensaje: "Operación exitosa",
      });
    } catch (error) {
      console.log(error);

      res.status(404).send({
        status: "error",
        mensaje: "Error en la eliminacion !",
        error: error.message,
      });
    }
  });
});

// autenticacion de un factor
users.post("/users/login", (req, res) => {
  //datos de la peticion (body)
  let correo = req.body.correo;
  let password = req.body.password;

  //validamos que la data esté completa
  if (!email || !password) {
    res.status(400).send({
      consulta: "error",
      mensaje: "faltan datos por enviar del formulario ! ",
    });
  }
  // buscar en la bd el usuario  y validar
  cnx.query(
    "SELECT nombre, apellido, correo, password FROM usuario WHERE correo = ? AND password = ?",
    [correo, password],
    (error, consulta) => {
      if (consulta.email == null) {
        res.status(400).send({
          status: "error",
          mensaje: "Usuario no existe en la BD",
        });
      } else {
        let pwd = bcrypt.compareSync(password, consulta.password);

        if (!pwd) {
          res.status(400).send({
            status: "error",
            mensaje: "Pwd Incorrecto !",
          });
        } else {
          res.status(200).send({
            consulta: "ok",
            mensaje: "Ingreso exitoso al sistema!",
            user: consulta.name + " " + consulta.lastname,
            email: consulta.email,
          });
        }
      }
    }
  );
});

module.exports = users;