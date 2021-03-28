const mysql = require("mysql");

const host = process.env.HOST;
const database = process.env.DATABASE;
const user = process.env.USER;
const sql_password = process.env.PASSWORD;

const connection = mysql.createConnection({
  host: host,
  user: user,
  database: database,
  password: sql_password,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting" + err.stack);
    return;
  }
  console.log("connected as id" + connection.threadId);
});

connection.query("SELECT * FROM User", (err, res, fields) => {
  if (err) {
    console.log("Query Error", err);
  }
  if (res) {
    console.log(res);
  }
});
