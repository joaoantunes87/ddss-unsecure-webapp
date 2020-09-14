/* schema */
DROP TABLE IF EXISTS user;
CREATE TABLE user(
   account_id  INTEGER PRIMARY KEY,
   email VARCHAR (50) UNIQUE NOT NULL,
   password VARCHAR (50) NOT NULL,
   name VARCHAR (50) NOT NULL
);

DROP TABLE IF EXISTS user_session;
CREATE TABLE user_session(
   session_id INTEGER PRIMARY KEY,
   account_id VARCHAR (50) NOT NULL
);

DROP TABLE IF EXISTS movement;
CREATE TABLE movement(
   movement_id  INTEGER PRIMARY KEY,
   from_account_id INTEGER NOT NULL,
   to_account_id INTEGER NOT NULL,
   amount REAL NOT NULL,
   description VARCHAR (512) NOT NULL
);

DROP TABLE IF EXISTS comment;
CREATE TABLE comment(
   comment_id INTEGER PRIMARY KEY NOT NULL,
   user_email VARCHAR (50) NOT NULL,
   user_name VARCHAR (50) NOT NULL,
   comment VARCHAR (512) NOT NULL
);

/* seeds */
INSERT INTO user(email, password, name)
VALUES ('jcfa@dei.uc.pt', '123456', 'João');