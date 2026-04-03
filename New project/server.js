const express = require('express');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'panda-cinema-geheim-sleutel-2024';
const DB_PATH = path.join(__dirname, 'cinema.db');

// ─── Database hulpfuncties ────────────────────────────────────────────────────
let db;

function slaDBOp() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Voer een query uit en geef alle rijen terug als array van objecten
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rijen = [];
  while (stmt.step()) {
    rijen.push(stmt.getAsObject());
  }
  stmt.free();
  return rijen;
}

// Voer een query uit en geef de eerste rij terug als object (of null)
function queryOne(sql, params = []) {
  const rijen = queryAll(sql, params);
  return rijen.length > 0 ? rijen[0] : null;
}

// Voer een schrijfquery uit (INSERT / UPDATE / DELETE)
function schrijf(sql, params = []) {
  db.run(sql, params);
  slaDBOp();
}

// ─── Database initialiseren ───────────────────────────────────────────────────
async function initDB() {
  const SQL = await initSqlJs();

  // Laad bestaande database of maak een nieuwe aan
  if (fs.existsSync(DB_PATH)) {
    const bestand = fs.readFileSync(DB_PATH);
    db = new SQL.Database(bestand);
  } else {
    db = new SQL.Database();
  }

  // Tabellen aanmaken
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    UNIQUE NOT NULL,
      email       TEXT    UNIQUE NOT NULL,
      password    TEXT    NOT NULL,
      is_admin    INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS films (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      studio      TEXT    NOT NULL,
      film_id     TEXT    UNIQUE NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      film_id     TEXT    NOT NULL,
      voted_at    TEXT    DEFAULT (datetime('now')),
      UNIQUE(user_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      film_id     TEXT    NOT NULL,
      film_title  TEXT    NOT NULL,
      film_hall   TEXT    NOT NULL,
      film_time   TEXT    NOT NULL,
      seats       TEXT    NOT NULL,
      total       TEXT    NOT NULL,
      date_label  TEXT    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  slaDBOp();

  // Standaard admin aanmaken als die nog niet bestaat
  const adminBestaat = queryOne('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!adminBestaat) {
    const gehashWachtwoord = bcrypt.hashSync('admin123', 10);
    schrijf(
      'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 1)',
      ['admin', 'admin@pandacinema.nl', gehashWachtwoord]
    );
    console.log('✅ Admin account aangemaakt: gebruikersnaam=admin, wachtwoord=admin123');
  }

  // Standaard films toevoegen als de tabel leeg is
  const filmAantal = queryOne('SELECT COUNT(*) as count FROM films');
  if (filmAantal && filmAantal.count === 0) {
    schrijf('INSERT OR IGNORE INTO films (title, studio, film_id) VALUES (?, ?, ?)',
      ['Aladdin', 'Disney', 'aladdin']);
    schrijf('INSERT OR IGNORE INTO films (title, studio, film_id) VALUES (?, ?, ?)',
      ['Avatar: Fire and Ash', 'Sci-fi event', 'avatar-fire-ash']);
    schrijf('INSERT OR IGNORE INTO films (title, studio, film_id) VALUES (?, ?, ?)',
      ['Project Hail Mary', 'Sony Pictures', 'project-hail-mary']);
    console.log('✅ Standaard films toegevoegd aan de database');
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Controleer JWT-token
function vereistIngelogd(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  try {
    const token = auth.slice(7);
    req.gebruiker = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessie verlopen, log opnieuw in' });
  }
}

// Controleer admin-rechten
function vereistAdmin(req, res, next) {
  vereistIngelogd(req, res, () => {
    if (!req.gebruiker.is_admin) {
      return res.status(403).json({ error: 'Geen toegang — alleen voor admins' });
    }
    next();
  });
}

// ─── Auth routes ──────────────────────────────────────────────────────────────

// Registreren
app.post('/api/registreren', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Vul alle velden in' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Wachtwoord moet minimaal 6 tekens zijn' });
  }

  const bestaand = queryOne(
    'SELECT id FROM users WHERE username = ? OR email = ?',
    [username, email]
  );
  if (bestaand) {
    return res.status(409).json({ error: 'Gebruikersnaam of e-mail is al in gebruik' });
  }

  try {
    const gehash = bcrypt.hashSync(password, 10);
    schrijf('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, gehash]);
    res.json({ success: true, message: 'Account aangemaakt! Je kunt nu inloggen.' });
  } catch (e) {
    res.status(500).json({ error: 'Registreren mislukt: ' + e.message });
  }
});

// Inloggen
app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Vul alle velden in' });
  }

  const gebruiker = queryOne(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );

  if (!gebruiker || !bcrypt.compareSync(password, gebruiker.password)) {
    return res.status(401).json({ error: 'Gebruikersnaam, e-mail of wachtwoord klopt niet' });
  }

  const isAdmin = gebruiker.is_admin === 1 || gebruiker.is_admin === true;

  const token = jwt.sign(
    {
      id: gebruiker.id,
      username: gebruiker.username,
      email: gebruiker.email,
      is_admin: isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    username: gebruiker.username,
    email: gebruiker.email,
    is_admin: isAdmin,
  });
});

// Huidige gebruiker opvragen
app.get('/api/mij', vereistIngelogd, (req, res) => {
  res.json(req.gebruiker);
});

// ─── Films routes ─────────────────────────────────────────────────────────────

// Alle films ophalen (openbaar)
app.get('/api/films', (req, res) => {
  const films = queryAll('SELECT * FROM films ORDER BY created_at ASC');
  res.json(films);
});

// Film toevoegen (alleen admin)
app.post('/api/films', vereistAdmin, (req, res) => {
  const { title, studio, film_id } = req.body;

  if (!title || !studio || !film_id) {
    return res.status(400).json({ error: 'Vul alle velden in (titel, studio, film-id)' });
  }

  const filmIdSchoon = film_id.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const bestaand = queryOne('SELECT id FROM films WHERE film_id = ?', [filmIdSchoon]);
  if (bestaand) {
    return res.status(409).json({ error: 'Dit film-ID bestaat al' });
  }

  schrijf('INSERT INTO films (title, studio, film_id) VALUES (?, ?, ?)',
    [title, studio, filmIdSchoon]);
  res.json({ success: true, film_id: filmIdSchoon });
});

// Film verwijderen (alleen admin)
app.delete('/api/films/:film_id', vereistAdmin, (req, res) => {
  const { film_id } = req.params;
  schrijf('DELETE FROM votes WHERE film_id = ?', [film_id]);
  schrijf('DELETE FROM films WHERE film_id = ?', [film_id]);
  res.json({ success: true });
});

// ─── Stemmen routes ───────────────────────────────────────────────────────────

// Stem uitbrengen (ingelogd vereist)
app.post('/api/stemmen', vereistIngelogd, (req, res) => {
  const { film_id } = req.body;

  const film = queryOne('SELECT id FROM films WHERE film_id = ?', [film_id]);
  if (!film) {
    return res.status(404).json({ error: 'Film niet gevonden' });
  }

  const bestaandeStem = queryOne('SELECT id FROM votes WHERE user_id = ?', [req.gebruiker.id]);
  if (bestaandeStem) {
    db.run('UPDATE votes SET film_id = ?, voted_at = datetime("now") WHERE user_id = ?',
      [film_id, req.gebruiker.id]);
    slaDBOp();
  } else {
    schrijf('INSERT INTO votes (user_id, film_id) VALUES (?, ?)', [req.gebruiker.id, film_id]);
  }

  res.json({ success: true });
});

// Mijn stem ophalen (ingelogd vereist)
app.get('/api/mijn-stem', vereistIngelogd, (req, res) => {
  const stem = queryOne('SELECT film_id FROM votes WHERE user_id = ?', [req.gebruiker.id]);
  res.json({ film_id: stem ? stem.film_id : null });
});

// Stemresultaten ophalen (alleen admin)
app.get('/api/stemresultaten', vereistAdmin, (req, res) => {
  const resultaten = queryAll(`
    SELECT
      f.title,
      f.film_id,
      f.studio,
      COUNT(v.id) AS stemmen
    FROM films f
    LEFT JOIN votes v ON f.film_id = v.film_id
    GROUP BY f.film_id
    ORDER BY stemmen DESC
  `);

  const totaal = resultaten.reduce((som, r) => som + (r.stemmen || 0), 0);
  res.json({ resultaten, totaal });
});

// ─── Aankopen routes ──────────────────────────────────────────────────────────

// Eigen aankopen ophalen (ingelogd vereist)
app.get('/api/aankopen', vereistIngelogd, (req, res) => {
  const aankopen = queryAll(
    'SELECT * FROM purchases WHERE user_id = ? ORDER BY created_at DESC LIMIT 4',
    [req.gebruiker.id]
  );

  // Seats JSON string terug naar array parsen
  const verwerkt = aankopen.map((a) => ({
    ...a,
    seats: JSON.parse(a.seats || '[]'),
  }));

  res.json(verwerkt);
});

// Aankoop opslaan (ingelogd vereist)
app.post('/api/aankopen', vereistIngelogd, (req, res) => {
  const { film_id, film_title, film_hall, film_time, seats, total, date_label } = req.body;

  if (!film_id || !film_title || !seats || !total) {
    return res.status(400).json({ error: 'Ongeldige aankoopgegevens' });
  }

  const seatsJSON = JSON.stringify(Array.isArray(seats) ? seats : []);

  schrijf(
    `INSERT INTO purchases (user_id, film_id, film_title, film_hall, film_time, seats, total, date_label)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.gebruiker.id, film_id, film_title, film_hall || '', film_time || '', seatsJSON, total, date_label || 'Vandaag']
  );

  res.json({ success: true });
});

// ─── Start server ─────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🐼 Panda Cinema server draait op http://localhost:${PORT}`);
    console.log(`   Admin inloggen:    gebruikersnaam=admin, wachtwoord=admin123`);
    console.log(`   Admin dashboard:   http://localhost:${PORT}/admin.html\n`);
  });
}).catch((err) => {
  console.error('Database kon niet worden gestart:', err);
  process.exit(1);
});
