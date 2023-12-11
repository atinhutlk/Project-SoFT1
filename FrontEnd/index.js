const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();

app.set('views', path.join(__dirname, 'html'));
app.engine('html', ejs.renderFile);
app.set('view engime', 'html');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('start.html');
});

app.get('/index.html', (req, res) => {
  res.render('index.html');
});

app.listen(3001);
