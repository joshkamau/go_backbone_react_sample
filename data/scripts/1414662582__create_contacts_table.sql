--  create contacts table --
-- @DO sql script --
CREATE TABLE contacts(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    mobile  VARCHAR(20),
    email VARCHAR(255)
);

-- @UNDO sql script --
DROP TABLE contacts;
