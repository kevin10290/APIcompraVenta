const express = require("express");
const vehiculos = express.Router();
const cnx = require("./MySql");

//insertar una persona : metodo post
vehiculos.post("/vehiculos/create", (req, res) => {
  let frmdata = {
    descripcion: req.body.descripcion,
    marca: req.body.marca,
    placa: req.body.placa,
    contrato: req.body.contrato
  };

  cnx.query("INSERT INTO vehiculo SET ?", frmdata, (error, data) => {
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

users.post("/vehiculos/edit", (req, res) => {
  let frmdata = {
    descripcion: req.body.descripcion,
    marca: req.body.marca,
    placa: req.body.placa,
    contrato: req.body.contrato
  };
  const idVehiculo = req.body.idVehiculo;
  cnx.query("UPDATE FROM vehiculo SET ? WHERE id = ?", [frmdata, idVehiculo], (error, data) => {
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

users.post("/vehiculos/delete/:id", (req, res) => {
  const idVehiculo = req.params.idVehiculo;
  cnx.query("DELETE vehiculo WHERE idVehiculo = ?", idVehiculo, (error, data) => {
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
users.post("/vehiculos/login", (req, res) => {
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
    "SELECT nombre, apellido, correo, password FROM vehiculo WHERE correo = ? AND password = ?",
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