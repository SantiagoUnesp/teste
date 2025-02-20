// Importar módulos
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Conectar ao banco de dados
const db_name = path.join(__dirname, 'db', 'database.db');
const db = new sqlite3.Database(db_name, (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Rotas

// Rota inicial
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Criar nova medição
app.post('/measurements', (req, res) => {
  const { value } = req.body;
  const sql = 'INSERT INTO measurements (value) VALUES (?)';
  db.run(sql, [value], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, value });
  });
});

// Listar todas as medições
app.get('/measurements', (req, res) => {
  const sql = 'SELECT * FROM measurements ORDER BY timestamp DESC';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ measurements: rows });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
