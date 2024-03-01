const MySql = require("mysql2");

const cnn = MySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_compraventa"
});

cnn.connect((error)=>{
    if (error) {
        console.log(error);
    } else {
        console.log("Connection Succesful!");
    }
});

module.exports = cnn;