

DROP TABLE IF EXISTS UserCollection;
DROP TABLE IF EXISTS UserAccount;

-- Create UserAccount table
CREATE TABLE UserAccount (
    username VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dateStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(255)
);

-- Create UserCollection table
CREATE TABLE UserCollection (
    uniqueSerialID VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    speciesID INT NOT NULL,
    speciesName VARCHAR(255) NOT NULL,
    geoTag VARCHAR(255),
    matchScore DECIMAL(5,2),
    dateCollected DATETIME,
    image VARCHAR(255),
    speciesFamily VARCHAR(255),
    FOREIGN KEY (username) REFERENCES UserAccount(username)
);
