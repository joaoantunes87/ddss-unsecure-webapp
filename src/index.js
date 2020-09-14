/* External dependencies */
const http = require("http");
const { resolve } = require("path");
const { parse } = require("url");
const querystring = require("querystring");

/* Database helpers */
const Db = require("./utils/db");

/* View helpers */
const View = require("./utils/view");

/* Cookie helpers */
const Cookie = require("./utils/cookie");

const requestListener = function (req, res) {
  let path = parse(req.url).pathname;
  console.log("URL and PARAMS: ", {
    url: req.url,
    path,
    params: req.params,
    method: req.method,
    cookies: Cookie.parse(req.headers.cookie),
  });

  /* Handle routes */
  if (path === "/sign_up" && req.method === "GET") {
    handleSignUpRoute(req, res);
  } else if (path === "/login" && req.method === "GET") {
    handleLoginRoute(req, res);
  } else if (path.startsWith("/movements") && req.method === "GET") {
    handleMovementCreationRoute(req, res);
  } else if (path.startsWith("/users") && req.method === "POST") {
    handleAccountCreationRoute(req, res);
  } else if (path === "/sessions" && req.method === "POST") {
    handleLoginValidationRoute(req, res);
  } else if (path === "/" && req.method === "GET") {
    handleHomeRoute(req, res);
  } else if (path.startsWith("/users/") && req.method === "GET") {
    handleUserPageRoute(req, res);
  } else if (path.startsWith("/forum") && req.method === "GET") {
    handleForumPageRoute(req, res);
  } else if (path.startsWith("/comments") && req.method === "POST") {
    handleCommentCreationRoute(req, res);
  } else {
    handleNotFoundPageRoute(req, res);
  }
};

const server = http.createServer(requestListener);
server.listen(8080);

function handleSignUpRoute(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(View.signUpFormPage());
  res.end();
}

function handleLoginRoute(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(View.loginFormPage());
  res.end();
}

function handleAccountCreationRoute(req, res) {
  processPostData(req, res, function createUser(userData) {
    Db.createUser({
      user: userData,
      onSuccess: function onSuccess(result) {
        res.writeHead(302, { Location: "/login" });
        res.end();
      },
      onError: function onError(errorMessage) {
        handleErrorPageRoute(errorMessage, res);
      },
    });
  });
}

function handleLoginValidationRoute(req, res) {
  processPostData(req, res, function createUser(userAuthData) {
    Db.loginUser({
      userAuth: userAuthData,
      onSuccess: function onSuccess(result) {
        res.writeHead(302, {
          Location: `users/${result.accountId}`,
          "Set-Cookie": `ddss_session=${result.sessionId}`,
        });
        res.end();
      },
      onError: function onError(errorMessage) {
        handleErrorPageRoute(errorMessage, res);
      },
    });
  });
}

function handleUserPageRoute(req, res) {
  const urlParsed = parse(req.url);
  const userId = urlParsed.pathname.split("/")[2];
  const queryParams = querystring.parse(urlParsed.query);

  if (userId) {
    const user = { id: userId };
    if (queryParams && queryParams.search) {
      Db.userMovements({
        user,
        queryParams,
        onSuccess: function (userMovements) {
          user.movements = userMovements;
          console.log("User: ", user);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(View.userPage({ user, queryParams }));
          res.end();
        },
        onError: function (errorMessage) {
          handleErrorPageRoute(errorMessage, res);
        },
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(View.userPage({ user, queryParams }));
      res.end();
    }
  } else {
    handleErrorPageRoute("No user defined", res);
  }
}

function handleMovementCreationRoute(req, res) {
  const urlParsed = parse(req.url);
  const userId = Cookie.parse(req.headers.cookie).ddss_session;
  const movementData = querystring.parse(urlParsed.query);
  movementData.from_account_id = parseInt(userId);

  Db.createMovement({
    movement: movementData,
    onSuccess: function onSuccess(result) {
      res.writeHead(302, {
        Location: `users/${userId}?successMessage=Movement with code ${result.id} was done with sucess`,
      });
      res.end();
    },
    onError: function onError(errorMessage) {
      handleErrorPageRoute(errorMessage, res);
    },
  });
}

function handleForumPageRoute(req, res) {
  const urlParsed = parse(req.url);
  const queryParams = querystring.parse(urlParsed.query);

  Db.allPublicComments({
    onSuccess: function (comments) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(View.forumPage({ comments, queryParams }));
      res.end();
    },
    onError: function (errorMessage) {
      handleErrorPageRoute(errorMessage, res);
    },
  });
}

function handleCommentCreationRoute(req, res) {
  processPostData(req, res, function createComment(commentData) {
    Db.createComment({
      comment: commentData,
      onSuccess: function onSuccess(result) {
        res.writeHead(302, {
          Location: `forum?successMessage=Comment with id ${result.id} was added`,
        });
        res.end();
      },
      onError: function onError(errorMessage) {
        handleErrorPageRoute(errorMessage, res);
      },
    });
  });
}

function handleHomeRoute(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(View.homePage());
  res.end();
}

function handleErrorPageRoute(errorMessage, res) {
  res.writeHead(500, { "Content-Type": "text/html" });
  res.write(View.errorPage({ errorMessage }));
  res.end();
}

function handleNotFoundPageRoute(req, res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.write(View.notFoundPage());
  res.end();
}

/* Helper */
function processPostData(req, res, onDataProcessed) {
  let queryData = "";
  req.on("data", function (data) {
    queryData += data;
    if (queryData.length > 1e6) {
      queryData = "";
      res.writeHead(413, { "Content-Type": "text/plain" }).end();
      req.connection.destroy();
    }
  });

  req.on("end", function () {
    const postForm = querystring.parse(queryData);
    onDataProcessed(postForm);
  });
}
