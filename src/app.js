const path = require("path");

const express = require("express");

const { router } = require("./router");

const viewsFolder = path.join(__dirname, "views");
const publicFolder = path.join(__dirname, "public");

const app = express();

app.set("views", viewsFolder);

app.set("view engine", "ejs");

app.use(express.static(publicFolder));

app.use(router);

exports.app = app;
