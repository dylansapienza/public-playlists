import express = require("express");
const spotifyroutes = require("./spotifyapi");
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
  playlist_uri: String;
};

const addTracktoDB = (track_data: track_data) => {
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
                addToPlaylist({
                  Item_ID: res.insertId,
                  Playlist_ID: track_data.playlist_uri,
                });
              }
            }
          );
        } else {
          console.log(res[0].title + " is already a Song_Item");
          addToPlaylist({
            Item_ID: res[0].Item_ID,
            Playlist_ID: track_data.playlist_uri,
          });

          // res.send("No Song_Item entry needed");
        }
      }
    }
  );
};
module.exports.addTracktoDB = addTracktoDB;

type playlist_reg = {
  name: String;
  uri: String;
};

const registerPlaylist = (playlist_reg: playlist_reg) => {
  connection.query(
    `INSERT INTO Playlist VALUES ("spotify:playlist:${playlist_reg.uri}", "${playlist_reg.name}")`,
    (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        console.log(`Playist ${playlist_reg.name} created!`);
      }
    }
  );
};
module.exports.registerPlaylist = registerPlaylist;

type In_Playlist_Data = {
  Item_ID: Number;
  Playlist_ID: String;
};

const addToPlaylist = (In_Playlist_Data: In_Playlist_Data) => {
  connection.query(
    `INSERT INTO In_Playlist (Item_ID, Playlist_ID, Votes) VALUES ("${In_Playlist_Data.Item_ID}", "spotify:playlist:${In_Playlist_Data.Playlist_ID}", "0")`,
    (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        console.log("Added to In_Playlist!");
      }
    }
  );
};
module.exports.addToPlaylist = addToPlaylist;

type vote_data = {
  Entry_ID: Number;
  User_ID: String;
  VoteVal: Number;
};

const voteOnSong = (req: express.Request, res: express.Response) => {
  const vote_data = req.body;

  //Check if vote already exists, if so update, if not create new ballot

  let ballot: Number;

  if (vote_data.VoteVal > 0) {
    ballot = 1;
  }
  if (vote_data.VoteVal == 0) {
    ballot = 0;
  }
  if (vote_data.VoteVal < 0) {
    ballot = -1;
  }

  connection.query(
    `SELECT * FROM Votes WHERE Entry_ID = ${vote_data.Entry_ID} AND User_ID = "${vote_data.User_ID}"`,
    (err, res) => {
      if (res[0]) {
        connection.query(
          `UPDATE Votes SET Value = ${ballot} WHERE Entry_ID = ${vote_data.Entry_ID} AND User_ID = "${vote_data.User_ID}"`,
          (err, res) => {
            if (err) {
              console.error(err);
            }
            if (res) {
              console.log(res);
              console.log("Vote Ballot Updated!");

              updateVoteCount(vote_data);
            }
          }
        );
      } else {
        connection.query(
          `INSERT INTO Votes (Entry_ID, User_ID, Value) VALUES (${vote_data.Entry_ID}, "1250899172", ${ballot});`,
          (err, res) => {
            if (err) {
              console.error(err);
            }
            if (res) {
              console.log(res);
              console.log("Vote Ballot Created!");

              updateVoteCount(vote_data);
            }
          }
        );
      }
    }
  );
};
module.exports.voteOnSong = voteOnSong;

const updateVoteCount = (vote_data: vote_data) => {
  //Update Vote Count
  connection.query(
    `UPDATE In_Playlist SET Votes = (SELECT SUM(Value) FROM Votes WHERE Entry_ID = ${vote_data.Entry_ID}) WHERE Entry_ID = ${vote_data.Entry_ID};`,
    (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        console.log("Votes Updated");

        // Need to Implement Spotify Side Playlist Updating

        // connection.query(
        //   `SELECT * FROM In_Playlist WHERE Entry_ID = ${vote_data.Entry_ID}`,
        //   (err, res) => {
        //     if (err) {
        //       console.error(err);
        //     }
        //     if (res) {

        // //   }

        // spotifyroutes.reorderPlaylist(vote_data);
      }
    }
  );

  //Check if song positions need to be adjusted
  //If ballot > 0, check location above
  //If ballot < 0, check location below
};

type login_data = {
  spotify_id: String;
  username: String;
  cookie: String;
};

const login = (login_data: login_data) => {
  connection.query(
    "SELECT * FROM User WHERE = ?",
    [login_data.spotify_id],
    (err, res) => {
      if (res) {
        if (!res[0]) {
          connection.query(
            `INSERT INTO User VALUES ("${login_data.spotify_id}", "${login_data.username}, ${login_data.cookie}")`,
            (err, res) => {
              if (err) {
              }
              if (res) {
              }
            }
          );
        } else {
          console.log(res[0].spotify_id + " is already a User");
          connection.query(
            `UPDATE User SET password = ${login_data.cookie} WHERE User_ID = "${login_data.spotify_id}"`,
            (err, res) => {
              if (err) {
              }
              if (res) {
              }
            }
          );
        }
      }
    }
  );
};
