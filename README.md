# Panda Cinema

Panda Cinema is een webapp voor een bioscoop, gebouwd met HTML, CSS, vanilla JavaScript en een Node.js backend.

Bezoekers kunnen films bekijken, zoeken en tickets reserveren. Daarnaast bevat de app login/registratie, een accountoverzicht en een adminpagina.

## Inhoud
- Introductie
- Functionaliteiten
- Techniek
- Installatie
- Project starten
- Gebruik van de website
- Testaccounts
- Projectstructuur
- Veelvoorkomende problemen

## Introductie
Deze repository bevat nu een enkele, opgeschoonde projectstructuur in de hoofdmap (geen dubbele versie meer).

Belangrijkste pagina's:
- Home/dashboard: `index.html`
- Filmoverzicht: `films.html`
- Stoelen kiezen en bestellen: `zitplaatsen.html` en `bestellen.html`
- Inloggen/registreren: `login.html` en `registreren.html`
- Gebruikersaccount: `account.html`
- Adminpaneel: `admin.html`

## Functionaliteiten
- Overzicht van films en planning
- Zoekfunctie op de filmpagina
- Stem-/keuzegedeelte op de homepage
- Stoelselectie en bestelstroom
- Registreren en inloggen met JWT
- Accountpagina met gebruikersinformatie
- Adminfunctionaliteit voor beheer
- Responsive layout voor desktop en mobiel

## Techniek
Frontend:
- HTML
- CSS (`styles.css`, `styles-extra.css`)
- JavaScript (`script.js`, `films.js`, etc.)

Backend:
- Node.js + Express (`server.js`)
- `sql.js` voor lokale database (`cinema.db`)
- JWT-authenticatie

## Installatie
Vereisten:
- Node.js 18+ (aanbevolen)
- npm

Installatiestappen:
1. Open een terminal in de projectmap.
2. Installeer dependencies:

```bash
npm install
```

## Project starten
Start de server:

```bash
npm start
```

Standaard draait de app op:
- `http://localhost:3000`

Open die URL in je browser om de website te gebruiken.

## Gebruik van de website
1. Ga naar `index.html` voor home/dashboard.
2. Ga naar `films.html` om films te bekijken en te zoeken.
3. Kies een film en ga via `zitplaatsen.html` naar reserveren.
4. Rond de bestelling af op `bestellen.html`.
5. Log in of registreer via `login.html` en `registreren.html`.
6. Bekijk je gegevens in `account.html`.
7. Gebruik `admin.html` voor beheer (alleen admin).

## Testaccounts
Bij de eerste start wordt automatisch een admin account aangemaakt als die nog niet bestaat:
- Gebruikersnaam: `admin`
- Wachtwoord: `admin123`

## Projectstructuur
Belangrijkste bestanden en mappen:

- `index.html` - home/dashboard
- `films.html` - filmoverzicht
- `zitplaatsen.html` - stoelselectie
- `bestellen.html` - besteloverzicht
- `login.html` - inloggen
- `registreren.html` - registreren
- `account.html` - accountpagina
- `admin.html` - adminomgeving
- `contact.html` - contactformulier
- `styles.css` - hoofdstijlen
- `styles-extra.css` - extra paginastijlen
- `script.js` - scripts voor homepage
- `films.js` - scripts voor filmoverzicht
- `server.js` - backend server
- `package.json` - npm scripts en dependencies
- `css_zip_import/` - gebruikte afbeeldingsassets

## Veelvoorkomende problemen
Server start niet:
- Controleer of dependencies zijn geinstalleerd met `npm install`.
- Controleer of poort 3000 vrij is.

Inloggen werkt niet:
- Controleer of de backend draait.
- Gebruik het admin testaccount hierboven.

Wijzigingen niet zichtbaar:
- Hard refresh in browser (`Ctrl+F5`).
- Controleer of je de juiste branch en laatste commits hebt.

## Notitie
Deze README is gericht op praktisch gebruik van dit project. Opdrachtinformatie en beoordelingscriteria kun je eventueel apart bewaren in documentatiebestanden als dat nodig is.