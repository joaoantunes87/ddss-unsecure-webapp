function generateHtmlFromTemplateWithContent(content) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>DDSS Unsecure Web App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

          <style>
            html,
            body {
              height: 100%;
            }

            html {
              box-sizing: border-box;
            }
            *, *:before, *:after {
              box-sizing: inherit;
            }
            
            body {
              padding-top: 40px;
              padding-bottom: 40px;
              background-color: #f5f5f5;
            }

            form .form-control {
              position: relative;
              height: auto;
              padding: 10px;
              font-size: 16px;
              margin-bottom: 16px;
            }

            .form-signin, .form-signup {
              width: 100%;
              max-width: 460px;
              padding: 15px;
              margin: auto;
            }
          </style>

        </head>
        <body class="text-center">        
          <main class="wrapper" style="max-width: 980px; margin: 0 auto; text-align:center">
            ${content}
          </main>
        </body>
      </html>
    `;
}

function loginFormPage() {
  return generateHtmlFromTemplateWithContent(`
      <form class="form-signin" action="/sessions" method="POST">
        <img class="mb-4" src="https://picsum.photos/96/96" alt="" width="96" height="96">
        <h1 class="h3 mb-3 font-weight-normal">Login</h1>

        <label for="email" class="sr-only">Email</label>
        <input id="email" type="email" class="form-control" placeholder="Your email" required>

        <label for="password" class="sr-only">Password</label>
        <input id="password" class="form-control" placeholder="Create a password" required>      

        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>            
        <a class="btn btn-lg btn-secondary btn-block" href="/sign_up">Register</a>            
      </form>
    `);
}

function signUpFormPage() {
  return generateHtmlFromTemplateWithContent(`
    <form class="form-signup" action="/users" method="POST">
      <img class="mb-4" src="https://picsum.photos/96/96" alt="" width="96" height="96">
      <h1 class="h3 mb-3 font-weight-normal">Please register your account</h1>

      <label for="name" class="sr-only">Name</label>
      <input id="name" class="form-control" placeholder="Your name" required autofocus>
      
      <label for="email" class="sr-only">Email</label>
      <input id="email" type="email" class="form-control" placeholder="Your email" required>

      <label for="password" class="sr-only">Password</label>
      <input id="password" class="form-control" placeholder="Create a password" required>      

      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>   
      <a class="btn btn-lg btn-secondary btn-block" href="/login">Login</a>               
    </form>
  `);
}

function userPage({ user, queryParams }) {
  return generateHtmlFromTemplateWithContent(`
    <h1>Movements</h1>    
    ${
      queryParams.search
        ? `<h2>Movements found for ${queryParams.search}</h2>
       <ul class="list-group">
        ${user.movements
          .map(function movementHtml(m) {
            return `<li class="list-group-item">${m.description} - ${m.amount}€</li>`;
          })
          .join("")}
       </ul>
      `
        : ""
    }
    ${
      queryParams && queryParams.successMessage
        ? `<h2>${queryParams.successMessage}</h2>`
        : ""
    }
    <form action="/users/${
      user.id
    }" method="GET" style="display:flex;flex-direction:column;align-content:center;">
      <h3>Search for your movements by description</h3>
      <label for="search">
        Search For:
        <input id="search" name="search" placeholder="Movement description" />
      </label>
      <button type="submit">Search</button>      
    </form>

    <h2>Transfer Money</h2>
    <form action="/movements" method="GET" style="display:flex;flex-direction:column;align-content:center;">
      <label for="to">
        Transfer to:
        <input id="to_account_id" name="to_account_id" placeholder="User id to receive amount" />
      </label>
      <label for="amount">
        Transfer amount:
        <input id="amount" type="number" name="amount" placeholder="Amount to transfer" />
      </label>    
      <label for="description">
        Movement description:
        <input id="description" name="description" placeholder="Description of movement" />
      </label>           
      <button type="submit">Transfer</button>      
    </form>  
    
    <a href="/forum">Go to forum</a>
  `);
}

function forumPage({ comments = [], queryParams }) {
  return generateHtmlFromTemplateWithContent(`
    <h1>Comments</h1>    
    ${
      queryParams && queryParams.successMessage
        ? `<h2>${queryParams.successMessage}</h2>`
        : ""
    }
    <form action="/comments" method="POST" style="display:flex;flex-direction:column;align-content:center;">
      <h3>Add your comment</h3>
      <label for="email">
        Email:
        <input id="email" name="email" placeholder="Your email" />
      </label>
      <label for="name">
        Name:
        <input id="name" name="name" placeholder="Your name" />
      </label>
      <label for="email">
        Comment:
        <input id="comment" name="comment" placeholder="Your comment" />
      </label>      
      <button type="submit">Comment</button>      
    </form>

    <h2>Last comments</h2>
    <ul>
      ${comments
        .map(function commentHtml(c) {
          return `<li>
              <p>${c.name}<${c.email}></p>
              <p>${c.comment}</p>
            </li>`;
        })
        .join("")}
    </ul>       
  `);
}

function homePage() {
  return generateHtmlFromTemplateWithContent(
    `<h1>Hello</h1><a href="/login">Go to login page</a>`
  );
}

function errorPage({ errorMessage }) {
  return generateHtmlFromTemplateWithContent(
    `<h1>Error</h1><h2>${errorMessage}</h2>`
  );
}

function notFoundPage() {
  return generateHtmlFromTemplateWithContent(
    '<h1>Not Found</h1><a href="/">Go home</a>'
  );
}

exports.loginFormPage = loginFormPage;
exports.signUpFormPage = signUpFormPage;
exports.errorPage = errorPage;
exports.notFoundPage = notFoundPage;
exports.homePage = homePage;
exports.userPage = userPage;
exports.forumPage = forumPage;
