const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => console.log('app: localhost://' + PORT));