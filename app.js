// app.js
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();
const connection = require('./connection');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

app.post('/bookmarks', (req, res) => {
  if (!req.body.url && !req.body.title) {
    return res.status(422).json({ error: 'required field(s) missing' });
  }
  connection.query('INSERT INTO bookmark SET ?', req.body, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message, sql: err.sql });

    connection.query('SELECT * FROM bookmark WHERE id = ?', stats.insertId,
      (err, records) => {
        if (err)
          return res.status(500).json({ error: err.message, sql: err.sql });
          return res.status(201).json(records[0]);
      }
    );
  });
});

app.get('/bookmarks/:id', (req, res) => {
  connection.query('SELECT * FROM bookmark WHERE id = ?', req.params.id, (err, results) => {
      if (err) {
          res.status(500).json({error: err.message, sql: err.sql});
      } else {
        if(results.length){
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({error: 'bookmark not found'})
        }
      }
  })
})

module.exports = app;
