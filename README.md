# BAKAI – Home Server Dashboard

Ein Angular-basiertes Web-Frontend zur Verwaltung und Überwachung eines Home Servers.

## Features

- **Dashboard** – Übersicht über Server-Kennzahlen (Bestellungen, Umsatz, Kunden, Kommentare)
- **MKV Mover** – Dateien (z. B. MKV-Videos) von einem Quellordner in einen Zielordner auf dem Server verschieben
- **API-Dokumentation** – Eingebettete Swagger UI zur Erkundung der Backend-REST-API
- **Mehrsprachigkeit** – Deutsch und Englisch, umschaltbar per Klick in der Topbar
- **Dark Mode** – Helles und dunkles Theme umschaltbar

## Voraussetzungen

- Node.js
- Angular CLI
- Backend-Server läuft auf `http://localhost:8080`

## Entwicklung

```bash
npm install
ng serve
```

Anschließend im Browser `http://localhost:4200/` öffnen.

## Build

```bash
ng build
```

Die Build-Artefakte landen im `dist/`-Verzeichnis.

## Projektstruktur

```
src/
├── app/
│   ├── layout/          # Topbar, Sidebar, Footer, Menü
│   ├── pages/
│   │   ├── dashboard/   # Dashboard mit Widgets
│   │   ├── apidocs/     # Swagger UI Einbettung
│   │   └── auth/        # Login, Fehlerseiten
│   └── shared/          # Wiederverwendbare Komponenten
└── assets/
    └── i18n/            # Übersetzungsdateien (de.json, en.json)
public/
└── i18n/                # Übersetzungsdateien (Laufzeit)
```

## Technologien

| Technologie | Version |
|---|---|
| Angular | 21 |
| PrimeNG | 21 |
| Tailwind CSS | 4 |
| ngx-translate | – |
