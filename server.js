
const multer = require('multer');
const fs = require('fs');

// Папка для збереження аватарів
const AVATAR_DIR = './public/assets/img/';

// Налаштування Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });


const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// 🔌 База даних
const db = new sqlite3.Database('./db/users.sqlite', (err) => {
  if (err) {
    console.error('❌ Помилка з базою:', err.message);
  } else {
    console.log('✅ База даних підключена');
  }
});

// 📦 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'yumi-super-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// 📋 Створення таблиці користувачів
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT,
    avatar TEXT DEFAULT 'default.png',
    age INTEGER,
    gender TEXT,
    favorite TEXT
)
`);

// ✅ РЕЄСТРАЦІЯ
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = 'default.png';

  // Перевірка: чи існує email або username
  db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email], async (err, user) => {
    if (user) {
      return res.status(400).json({ error: 'Логін або email вже використовується.' });
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`,
        [username, email, hash, avatar],
        function (err) {
          if (err) return res.status(400).json({ error: 'Помилка при створенні користувача.' });
          req.session.user = username;
          res.json({ success: true });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  });
});

// 🔑 ВХІД
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Невірний логін або пароль.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Невірний логін або пароль.' });
    }

    req.session.user = user.username;
    res.json({ success: true });
  });
});

// 📤 СЕССІЯ / ПРОФІЛЬ
app.get('/api/session', (req, res) => {
  if (!req.session.user) return res.json({ user: null });

  db.get(
    `SELECT username, email, avatar, age, gender, favorite FROM users WHERE username = ?`,
    [req.session.user],
    (err, user) => {
      if (err || !user) {
        return res.json({ user: null });
      }
      res.json({ user });
    }
  );
});

// 📝 ОНОВЛЕННЯ ПРОФІЛЮ
app.post('/api/update-profile', (req, res) => {
  if (!req.session.user) return res.status(403).json({ error: 'Неавторизовано' });

  const { username, email, age, gender, favorite } = req.body;

  db.run(
    `UPDATE users SET 
      username = ?, 
      email = ?, 
      age = ?, 
      gender = ?, 
      favorite = ?
     WHERE username = ?`,
    [username, email, age, gender, favorite, req.session.user],
    function (err) {
      if (err) return res.status(500).json({ error: 'Помилка при оновленні профілю' });

      req.session.user = username; // оновлюємо сесію
      res.json({ success: true });
    }
  );
});

// 🚪 ВИХІД
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// ▶ СТАРТ СЕРВЕРА
app.listen(PORT, () => {
  console.log(`✅ Сервер працює на http://localhost:${PORT}`);
});

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.session.user) return res.status(403).json({ error: 'Неавторизовано' });
  const avatarFile = req.file.filename;

  db.run(`UPDATE users SET avatar = ? WHERE username = ?`, [avatarFile, req.session.user], (err) => {
    if (err) return res.status(500).json({ error: 'Помилка оновлення аватару' });
    res.json({ success: true, avatar: avatarFile });
  });
});