SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Song_Item;
DROP TABLE IF EXISTS Votes;
DROP TABLE IF EXISTS Playlist;
DROP TABLE IF EXISTS InPlaylist;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `User` (
	`User_ID` VARCHAR(128) NOT NULL,
	`username` VARCHAR(64) NOT NULL,
	`password` VARCHAR(64) NOT NULL,
	PRIMARY KEY (`User_ID`,`username`)
);

CREATE TABLE `Song_Item` (
	`Item_ID` INT(9) NOT NULL AUTO_INCREMENT,
	`uri` VARCHAR(128) NOT NULL,
	`title` VARCHAR(128) NOT NULL,
    `artist` VARCHAR(128),
    `album` VARCHAR(128),
    `album_art` VARCHAR(128),
	PRIMARY KEY (`Item_ID`)
);

CREATE TABLE `Votes` (
	`Vote_ID` INT(9) NOT NULL AUTO_INCREMENT,
	`Item_ID` INT(9) NOT NULL,
	`User_ID` VARCHAR(64) NOT NULL,
    `Value` INT(1) NOT NULL,
	PRIMARY KEY (`Vote_ID`),
    FOREIGN KEY (`Item_ID`) REFERENCES Song_Item(`Item_ID`),
    FOREIGN KEY (`User_ID`) REFERENCES User(`User_ID`)
);

CREATE TABLE `Playlist` (
    `Playlist_ID` VARCHAR(128) NOT NULL,
    `playlist_name` VARCHAR(128),
    PRIMARY KEY(`Playlist_ID`)
);

CREATE TABLE `InPlaylist`(
    `Entry_ID` INT(9) NOT NULL AUTO_INCREMENT,
    `Item_ID` INT(9) NOT NULL,
    `Playlist_ID` VARCHAR(128) NOT NULL,
    `Votes` INT(9),
    PRIMARY KEY(`Entry_ID`),
    FOREIGN KEY (`Item_ID`) REFERENCES Song_Item(`Item_ID`),
    FOREIGN KEY (`Playlist_ID`) REFERENCES Playlist(`Playlist_ID`)
);
