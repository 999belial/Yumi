const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./db/users.sqlite');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'yumi-super-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Создание таблицы пользователей
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT,
  password TEXT
)`);

// API: Регистрация
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hash], function (err) {
    if (err) return res.status(400).json({ error: 'Користувач вже існує.' });
    req.session.user = username;
    res.json({ success: true });
  });
});

// API: Авторизация
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Невірний логін або пароль.' });
    }
    req.session.user = user.username;
    res.json({ success: true });
  });
});

// API: Проверка сессии
app.get('/api/session', (req, res) => {
  res.json({ user: req.session.user || null });
});

// API: Выход
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер працює на http://localhost:${PORT}`);
});
