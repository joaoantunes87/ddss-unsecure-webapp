function generateHtmlFromTemplateWithContent(content) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>DDSS Unsecure Web App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>        
          <main class="wrapper" style="max-width: 980px; margin: 0 auto; text-align:center">
            ${content}
          </main>
        </body>
      </html>
    `;
}

function loginFormPage() {
  return generateHtmlFromTemplateWithContent(`
      <form action="/sessions" method="POST" style="display:flex;flex-direction:column;align-content:center;">
        <label for="email">
          Email:
          <input id="email" name="email" placeholder="Email" />
        </label>
        <label for="password">
          Password:
          <input id="password" name="password" placeholder="Password" />
        </label>
        <button type="submit">Login</button>      
      </form>
    `);
}

function signUpFormPage() {
  return generateHtmlFromTemplateWithContent(`
    <form action="/users" method="POST" style="display:flex;flex-direction:column;align-content:center;">
      <label for="name">
        Name:
        <input id="name" name="name" placeholder="Your name" />
      </label>
      <label for="email">
        Email:
        <input id="email" name="email" placeholder="Email" />
      </label>
      <label for="password">
        Password:
        <input id="password" name="password" placeholder="Password" />
      </label>
      <button type="submit">Register</button>      
    </form>
  `);
}

function userPage({ user, queryParams }) {
  return generateHtmlFromTemplateWithContent(`
    <h1>Movements</h1>    
    ${
      queryParams.search
        ? `<h2>Movements found for ${queryParams.search}</h2>
       <ul>
        ${user.movements
          .map(function movementHtml(m) {
            return `<li>To: ${m.to}, From: ${m.from}, Amount: ${m.amount}</li>`;
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
