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

CREATE TABLE `Playlist` (
    `Playlist_ID` VARCHAR(128) NOT NULL,
    `playlist_name` VARCHAR(128),
    PRIMARY KEY(`Playlist_ID`)
);

CREATE TABLE `In_Playlist`(
    `Entry_ID` INT(9) NOT NULL AUTO_INCREMENT,
    `Item_ID` INT(9) NOT NULL,
    `Playlist_ID` VARCHAR(128) NOT NULL,
    `Votes` INT(9),
    PRIMARY KEY(`Entry_ID`),
    FOREIGN KEY (`Item_ID`) REFERENCES Song_Item(`Item_ID`),
    FOREIGN KEY (`Playlist_ID`) REFERENCES Playlist(`Playlist_ID`)
);

CREATE TABLE `Votes` (
	`Vote_ID` INT(9) NOT NULL AUTO_INCREMENT,
	`Entry_ID` INT(9) NOT NULL,
	`User_ID` VARCHAR(64) NOT NULL,
    `Value` INT(1) NOT NULL,
	PRIMARY KEY (`Vote_ID`),
    FOREIGN KEY (`Entry_ID`) REFERENCES In_Playlist(`Entry_ID`),
    FOREIGN KEY (`User_ID`) REFERENCES User(`User_ID`)
);

--Sample Data

INSERT INTO User VALUES("1250899172", "dylsapienza12", "pass123");
INSERT INTO User VALUES("bevans", "billevans7", "jazz251");
INSERT INTO User VALUES("efitz", "ellafitzgerald", "sing123");
INSERT INTO User VALUES("jrmat20", "jrmat20", "whimper20");

INSERT INTO Song_Item VALUES(1, "spotify:track:7MAibcTli4IisCtbHKrGMh", "Leave The Door Open", "Silk Sonic", "An Evening with Silk Sonic", "");
INSERT INTO Song_Item VALUES(2, "spotify:track:2Itnx6zp6Ztkex5JnRcy3U", "Bodies - Intro", "Jazmine Sullivan", "Heaux Tales", "");
INSERT INTO Song_Item VALUES(3, "spotify:track:4ejQlM2w2X2AJqWYcMyNVm", "Heaven", "Pink Sweat", "PINK PLANET", "");
INSERT INTO Song_Item VALUES(4, "spotify:track:5qAqBkA9qT0kpV1m8Sccc4", "Peri's Scope", "Bill Evans", "Portrait In Jazz", "");
INSERT INTO Song_Item VALUES(5, "spotify:track:2d64G7VaZdHQuAquz5HQNu", "That Old Feeling", "Chet Baker", "Chet Baker Sings", "");
INSERT INTO Song_Item Values(6, "spotify:track:5snRg0trIQBltwJZhVGlxr", "In Walked Bud", "Thelonious Monk", "Underground (Special Edition)", "")


INSERT INTO Playlist VALUES("spotify:playlist:1Nzv5B0KGgqyo1I53YN0Pk", "Jazz");
INSERT INTO Playlist VALUES("spotify:playlist:7tuTpeNJqJPDCTZrNkEVOv", "Neo-Soul");

INSERT INTO In_Playlist VALUES(1, 1, "spotify:playlist:1Nzv5B0KGgqyo1I53YN0Pk", 0);
INSERT INTO In_Playlist VALUES(2, 2, "spotify:playlist:1Nzv5B0KGgqyo1I53YN0Pk", 0);
INSERT INTO In_Playlist VALUES(3, 3, "spotify:playlist:1Nzv5B0KGgqyo1I53YN0Pk", 0);
INSERT INTO In_Playlist VALUES(4, 4, "spotify:playlist:7tuTpeNJqJPDCTZrNkEVOv", 0);
INSERT INTO In_Playlist VALUES(5, 5, "spotify:playlist:7tuTpeNJqJPDCTZrNkEVOv", 0);
INSERT INTO In_Playlist VALUES(6, 6, "spotify:playlist:7tuTpeNJqJPDCTZrNkEVOv", 0);
INSERT INTO In_Playlist VALUES(7, 2, "spotify:playlist:7tuTpeNJqJPDCTZrNkEVOv", 0);

INSERT INTO Votes VALUES(1, 2, '1250899172', 1);
INSERT INTO Votes VALUES(2, 7, '1250899172', -1);
INSERT INTO Votes VALUES(3, 5, '1250899172', 1);
INSERT INTO Votes VALUES(4, 3, '1250899172', 0);
INSERT INTO Votes VALUES(5, 4, 'efitz', 1);
INSERT INTO Votes VALUES(6, 5, 'efitz', 1);
INSERT INTO Votes VALUES(7, 6, 'efitz', 1);
INSERT INTO Votes VALUES(8, 2, 'bevans', 1);
INSERT INTO Votes VALUES(9, 1, 'bevans', 1);
INSERT INTO Votes VALUES(10, 3, 'bevans', -1);
INSERT INTO Votes VALUES(11, 1, 'jrmat20', 1);
INSERT INTO Votes VALUES(12, 2, 'jrmat20', 1);
INSERT INTO Votes VALUES(13, 5, 'jrmat20', 1);


-- Get Playlist Data Query

    -- Generic

SELECT *
    FROM Playlist 
    INNER JOIN In_Playlist 
        ON Playlist.Playlist_ID = In_Playlist.Playlist_ID
        AND Playlist.Playlist_ID = "spotify_playlist_id_here"
    LEFT JOIN Song_Item
        ON In_Playlist.Item_ID = Song_Item.Item_ID;
        

    -- Specific

SELECT Playlist.playlist_name, Song_Item.title, Song_Item.artist, In_Playlist.Votes
    FROM Playlist 
    INNER JOIN In_Playlist 
        ON Playlist.Playlist_ID = In_Playlist.Playlist_ID
        AND Playlist.Playlist_ID = "spotify:playlist:1Nzv5B0KGgqyo1I53YN0Pk"
    LEFT JOIN Song_Item
        ON In_Playlist.Item_ID = Song_Item.Item_ID;

    -- +---------------+------------------+------------------+-------+
    -- | playlist_name | title            | artist           | Votes |
    -- +---------------+------------------+------------------+-------+
    -- | Neo-Soul      | Peri's Scope     | Bill Evans       |     0 |
    -- | Neo-Soul      | That Old Feeling | Chet Baker       |     0 |
    -- | Neo-Soul      | Bodies - Intro   | Jazmine Sullivan |     0 |
    -- +---------------+------------------+------------------+-------+

-- Vote Updating Queries

SELECT Entry_ID, SUM(Value) 
    FROM Votes 
        GROUP BY Entry_ID;

-- Update all Vote Values

UPDATE In_Playlist
    SET Votes = (SELECT SUM(Value) 
                    FROM Votes
                    WHERE In_Playlist.Entry_ID=Votes.Entry_ID
                    GROUP BY Entry_ID );

-- Update Specific Vote Value
    --Entry_ID is the In_Playlist Song Val

UPDATE In_Playlist 
    SET Votes = 
        (SELECT SUM(Value) 
            FROM Votes
                WHERE Entry_ID = 2)
    WHERE Entry_ID = 2;
    

    -- +----------+------------+
    -- | Entry_ID | SUM(Value) |
    -- +----------+------------+
    -- |        1 |          2 |
    -- |        2 |          3 |
    -- |        3 |         -1 |
    -- |        4 |          1 |
    -- |        5 |          3 |
    -- |        7 |         -1 |
    -- +----------+------------+

-- Set all Votes to 0

UPDATE In_Playlist SET Votes = 0;

-- Upvote Insert

INSERT INTO Votes (Entry_ID, User_ID, Value) VALUES (4, '1250899172', 1);

-- Downvote Insert

INSERT INTO Votes (Entry_ID, User_ID, Value) VALUES (4, '1250899172', -1);

-- Remove Vote Insert

INSERT INTO Votes (Entry_ID, User_ID, Value) VALUES (4, '1250899172', 0);

