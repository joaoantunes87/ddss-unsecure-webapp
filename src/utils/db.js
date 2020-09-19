const sqlite3 = require("sqlite3");

const DB_PATH = "./db/baking.db";

function openDbConnection() {
  return new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  });
}

function closeDbConnection(dbConn) {
  dbConn.close(function (err) {
    if (err) {
      console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
}

function createUser({ user, onSuccess, onError }) {
  const db = openDbConnection();

  // insert one row into the user table
  db.run(
    `INSERT INTO user(email, password, name)
  VALUES ('${user.email}', '${user.password}', '${user.name}')`,
    function (err) {
      if (err) {
        onError(err.message);
      }

      onSuccess({ id: this.lastID });
    }
  );

  // close the database connection
  db.close();
}

function fetchUserBySessionId({ sessionId, onSuccess, onError }) {
  const db = openDbConnection();

  const sqlQuery = `SELECT user.account_id, user.name from user, user_session where user.account_id = user_session.account_id AND user_session.session_id = "${sessionId}"`;
  console.log("sqlQuery: ", sqlQuery);
  db.all(sqlQuery, function (err, rows) {
    if (err) {
      onError(err.message);
      return;
    }

    onSuccess(rows.length > 0 ? rows[0] : undefined);
  });

  // close the database connection
  db.close();
}

function fetchUserById({ userId, onSuccess, onError }) {
  const db = openDbConnection();
  const sqlQuery = `SELECT account_id, name from user where account_id =  "${userId}"`;

  db.all(sqlQuery, function (err, rows) {
    if (err) {
      onError(err.message);
      return;
    }

    onSuccess(rows.length > 0 ? rows[0] : undefined);
  });

  // close the database connection
  db.close();
}

function deleteSessionById({ sessionId, onSuccess, onError }) {
  const db = openDbConnection();

  // insert one row into the user table
  db.run(
    `DELETE FROM user_session where user_session.session_id = "${sessionId}"`,
    function (err) {
      if (err) {
        onError(err.message);
      }

      onSuccess();
    }
  );

  // close the database connection
  db.close();
}

function loginUser({ userAuth, onSuccess, onError }) {
  const db = openDbConnection();

  // Get user from database with email
  // Compare passwords
  const sqlQuery = `SELECT account_id from user WHERE email="${userAuth.email}" AND password="${userAuth.password}"`;
  console.log("sqlQuery: ", sqlQuery);
  db.all(sqlQuery, function (err, rows) {
    if (err) {
      onError(err.message);
      return;
    }

    if (rows.length > 0) {
      const accountId = rows[0].account_id;

      // create session
      const insertQuery = `INSERT INTO user_session(account_id)
      VALUES (${accountId})`;

      console.log("Insert query: ", insertQuery);

      db.run(insertQuery, function (err) {
        if (err) {
          onError(err.message);
        }

        onSuccess({ accountId, sessionId: this.lastID });
      });
    } else {
      onError("Not possible to login");
    }
  });

  // close the database connection
  db.close();
}

function userMovements({ user, queryParams, onSuccess, onError }) {
  const db = openDbConnection();

  const sqlQuery = `SELECT description, amount, to_account_id, from_account_id 
    from movement 
    WHERE description LIKE "%${queryParams.search}%" AND (to_account_id=${user.id} OR from_account_id="${user.id}")`;

  console.log("sqlQuery: ", sqlQuery);

  db.all(sqlQuery, function (err, rows) {
    if (err) {
      console.log("Error: ", err);
      onError(err.message);
      return;
    }
    console.log("Rows: ", rows);
    const movements = rows.map(function copyMovement(row) {
      return {
        amount: row.amount,
        description: row.description,
        to: row.to_account_id,
        from: row.from_account_id,
      };
    });

    onSuccess(movements);
  });

  // close the database connection
  db.close();
}

function createMovement({ movement, onSuccess, onError }) {
  const db = openDbConnection();

  // insert one row into the movement table
  const insertQuery = `INSERT INTO movement(from_account_id, to_account_id, amount, description)
  VALUES (${movement.from_account_id}, ${movement.to_account_id}, ${movement.amount}, '${movement.description}')`;

  console.log("Insert query: ", insertQuery);

  db.run(insertQuery, function (err) {
    if (err) {
      onError(err.message);
    }

    onSuccess({ id: this.lastID });
  });

  // close the database connection
  db.close();
}

function allPublicComments({ onSuccess, onError }) {
  const db = openDbConnection();

  const sqlQuery = `SELECT comment_id, user_email, user_name, comment 
    from comment`;

  console.log("sqlQuery: ", sqlQuery);

  db.all(sqlQuery, function (err, rows) {
    if (err) {
      console.log("Error: ", err);
      onError(err.message);
      return;
    }
    console.log("Rows: ", rows);
    const comments = rows.map(function copyMovement(row) {
      return {
        id: row.comment_id,
        email: row.user_email,
        name: row.user_name,
        comment: row.comment,
      };
    });

    onSuccess(comments);
  });

  // close the database connection
  db.close();
}

function createComment({ comment, onSuccess, onError }) {
  const db = openDbConnection();

  // insert one row into the movement table
  const insertQuery = `INSERT INTO comment(user_email, user_name, comment)
  VALUES ('${comment.email}', '${comment.name}', '${comment.comment}')`;

  console.log("Insert query: ", insertQuery);

  db.run(insertQuery, function (err) {
    if (err) {
      onError(err.message);
    }

    onSuccess({ id: this.lastID });
  });

  // close the database connection
  db.close();
}

exports.createUser = createUser;
exports.fetchUserBySessionId = fetchUserBySessionId;
exports.fetchUserById = fetchUserById;
exports.deleteSessionById = deleteSessionById;
exports.loginUser = loginUser;
exports.userMovements = userMovements;
exports.createMovement = createMovement;
exports.allPublicComments = allPublicComments;
exports.createComment = createComment;
