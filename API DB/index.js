const express = require('express');
const Firebird = require('node-firebird');
const path = require('path');

//Config:
const options = {
    host:'127.0.0.1',
    port: 3050,
    database: path.resolve(__dirname, '../dados/GP.FDB'),
    user: 'sysdba',
    password: 'masterkey',
    lowercase_keys: false,
    role: null,
    pageSize: 4096
};

const app = express()
const port = 3000

function connectToDatabase(query, callback) {
    Firebird.attach(options, function(err, db) {
      if (err) {
        callback(err, null);
        return;
      }

      db.query(query, function(err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }

        // Fechar a conexão após a consulta
        db.detach();
      });
    });
  }

app.get('/api/dados', (req, res) => {
    const query = 'SELECT * FROM entidade'; // Substitua pela sua consulta SQL

    connectToDatabase(query, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(result);
      }
    });
  });

//iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});