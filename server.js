const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require('./routes/routes.js')(app);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(PORT, () => console.log('app: http://localhost:' + PORT));