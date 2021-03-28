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

type track_data = {
  uri: String;
  title: String;
  artist: String;
  album: String;
  album_art: String;
};

const addTracktoDB = (track_data: track_data) => {
  console.log("DB ENTERED");
  connection.query(
    "SELECT * FROM Song_Item WHERE uri = ?",
    [track_data.uri],
    (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        if (!res[0]) {
          connection.query(
            `INSERT INTO Song_Item (uri, title, artist, album, album_art) VALUES ("${track_data.uri}", "${track_data.title}", "${track_data.artist}", "${track_data.album}", "${track_data.album_art}")`,
            (err, res) => {
              if (err) {
                console.error(err);
              }
              if (res) {
                console.log(res);
              }
            }
          );
        } else {
          console.log(res[0].title + " is already a Song_Item");
        }
      }
    }
  );
};
module.exports.addTracktoDB = addTracktoDB;
