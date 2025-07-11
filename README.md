# Borealle-Digital-Wallet

## Backend API

This repository now includes a simple Flask backend located in `backend/app.py` implementing a reservation system for a restaurant. The API uses SQLite and exposes endpoints to manage clients, tables, dishes, reservations and orders.

### Setup

```bash
pip install -r requirements.txt
FLASK_APP=backend/app.py flask db upgrade  # create database
FLASK_APP=backend/app.py flask run
```

All responses are JSON and CORS is enabled for browser access.
