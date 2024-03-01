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

users.get("/users/select", (req, res) => {
  cnx.query("SELECT * FROM usuario", (error, data) => {
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
users.post("/users/create", [upload.single("photo")], (req, res) => {
    if (!req.file && !req.files) {
      res.status(404).send({
          status: "Error",
          message: "No existe el archivo."
      });
  }
  //* Solo las extensiones png, jpg, jpeg
  let archivo = req.file.originalname;
  let extension = archivo.split(".");
  extension = extension[1];
  if (extension != "png" && extension != "jpg" && extension != "jpeg") {
      fs.unlink(req.file.path,(err)=>{
          if (err) {
              res.status(400).send({
                  status: "Error_DeleteFile",
                  message: err
              });
          }
      })
      res.status(402).send({
          status: "Error",
          message: "La extensión no es valida."
      });
  } else {
      // Recibimos la imagen al subir
      let photo = req.file.filename;
      let frmdata = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        posicion: req.body.posicion,
        correo: req.body.correo,
        password: bcrypt.hashSync(req.body.password, 10),
        foto: photo,
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
  }
});

users.put("/users/edit/:id", (req, res) => {
  if (!req.file && !req.files) {
    res.status(404).send({
        status: "Error",
        message: "No existe el archivo."
    });
}
//* Solo las extensiones png, jpg, jpeg
let archivo = req.file.originalname;
let extension = archivo.split(".");
extension = extension[1];
if (extension != "png" && extension != "jpg" && extension != "jpeg") {
    fs.unlink(req.file.path,(err)=>{
        if (err) {
            res.status(400).send({
                status: "Error_DeleteFile",
                message: err
            });
        }
    })
    res.status(402).send({
        status: "Error",
        message: "La extensión no es valida."
    });
} else {
    // Recibimos el id
    let id = req.params.id;
    // Recibimos la imagen al subir
    let photo = req.file.filename;
    let frmdata = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      posicion: req.body.posicion,
      correo: req.body.correo,
      password: bcrypt.hashSync(req.body.password, 10),
      foto: photo,
    };
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
  }
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