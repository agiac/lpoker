const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <html>
        <body>
            <h1>LPoker</h1>
        </body>
    </html>
  `);
});

exports.app = app;
