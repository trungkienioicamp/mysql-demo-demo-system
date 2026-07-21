# MySQL Demo Full Stack

Simple Node.js + MySQL backend and React frontend.

## Requirements

- Node.js 20+
- MySQL running locally on `localhost:3306`
- MySQL user `root` with no password

## Run

```bash
npm install
npm run db:seed
npm run dev
```

Backend: `http://localhost:3001`

Frontend: `http://localhost:5173`

API:

```bash
curl http://localhost:3001/api/staffs
```
