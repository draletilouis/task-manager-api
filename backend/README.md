# Task Manager - Full Stack Application

A modern full-stack task management application with collaborative workspaces.

## Project Structure

This is a monorepo containing both frontend and backend:

```
task-manager/
├── backend/          # Node.js + Express + Prisma API
└── frontend/         # React + Vite application
```

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Tech Stack

**Backend:**
- Node.js + Express
- Prisma ORM + SQLite
- JWT Authentication
- Jest + Supertest

**Frontend:**
- React 19
- Vite
- TailwindCSS
- React Router
- Axios
- React Query

## Documentation

- [Backend Documentation](./backend/README.md)
- Frontend documentation (coming soon)

## License

This project is for educational purposes.
