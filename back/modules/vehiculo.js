const express = require("express");
const vehiculos = express.Router();
const cnx = require("./MySql");

//insertar una persona : metodo post
vehiculos.get("/vehiculos/select", (req, res) => {
  cnx.query("SELECT * FROM vehiculo", (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);

      res.status(404).send({
        status: "error",
        mensaje: "Error en la seleccion !",
        error: error.message,
      });
    }
  });
});

//insertar una persona : metodo post
vehiculos.post("/vehiculos/create", (req, res) => {
  let frmdata = {
    descripcion: req.body.descripcion,
    marca: req.body.marca,
    placa: req.body.placa,
    contrato: req.body.contrato,
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

users.put("/vehiculos/edit/:id", (req, res) => {
  let frmdata = {
    descripcion: req.body.descripcion,
    marca: req.body.marca,
    placa: req.body.placa,
    contrato: req.body.contrato,
  };
  const id = req.params.id;
  cnx.query(
    "UPDATE FROM vehiculo SET ? WHERE idVehiculo = ?",
    [frmdata, id],
    (error, data) => {
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
    }
  );
});

users.delete("/vehiculos/delete/:id", (req, res) => {
  const id = req.params.id;
  cnx.query(
    "DELETE vehiculo WHERE idVehiculo = ?",
    id,
    (error, data) => {
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
    }
  );
});

module.exports = vehiculos;
