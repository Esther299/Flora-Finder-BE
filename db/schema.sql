CREATE TABLE UserAccount (
    username VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dateStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(255) DEFAULT 'default_avatar.png'
);

CREATE TABLE UserCollection (
    uniqueSerialID UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    speciesID INT NOT NULL,
    speciesName VARCHAR(255) NOT NULL,
    geoTag GEOMETRY NOT NULL,
    matchScore DECIMAL(5, 2) DEFAULT 0,
    dateCollected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255) NOT NULL,
    speciesFamily VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES UserAccount(username)
);



--SELECT ua.username, ua.name, ua.email, ua.dateStamp, ua.avatar, COUNT(uc.speciesID) AS totalSpecies
--FROM UserAccount ua
--LEFT JOIN UserCollection uc ON ua.username = uc.username
--GROUP BY ua.username, ua.name, ua.email, ua.dateStamp, ua.avatar;