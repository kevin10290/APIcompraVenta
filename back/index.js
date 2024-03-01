const express = require("express");
const mod_fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use("/", require("./modules/users"));
app.use("/", require("./modules/vehiculos"));

app.listen(port, () => {
    console.log("App encendida: "+port);
})