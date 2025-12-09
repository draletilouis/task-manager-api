# Task Manager - Full Stack Application

A modern, collaborative task management application with workspaces, projects, and real-time task tracking.

## Monorepo Structure

```
task-manager/
├── backend/          # Node.js + Express + Prisma REST API
│   ├── src/
│   ├── tests/
│   ├── prisma/
│   └── README.md     # Detailed backend documentation
└── frontend/         # React + Vite SPA
    ├── src/
    └── README.md     # Frontend documentation (coming soon)
```

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Run Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
Backend API: `http://localhost:5000`

### Run Frontend

```bash
cd frontend
npm install  
npm run dev
```
Frontend UI: `http://localhost:5173`

---

## 🛠️ Tech Stack

### Backend
| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| **Node.js**    | Backend runtime (ES modules)      |
| **Express.js** | REST API framework                |
| **Prisma ORM** | Database toolkit (SQLite for dev) |
| **JWT**        | Token-based auth system           |
| **bcrypt**     | Password hashing                  |
| **Jest**       | Testing framework                 |
| **Supertest**  | API integration testing           |

### Frontend
| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| **React 19**        | UI library                  |
| **Vite**            | Build tool & dev server     |
| **TailwindCSS**     | Utility-first CSS framework |
| **React Router**    | Client-side routing         |
| **Axios**           | HTTP client for API calls   |
| **Context API**     | State management (Auth)     |

---

## ✅ Completed Features

### Authentication System
- **Backend**: User registration & login with JWT tokens
- **Frontend**: Complete authentication UI implementation
  - Login and registration forms with validation
  - Authentication context provider for global state
  - Protected routes with automatic redirection
  - Axios interceptors for token management
  - Persistent login with localStorage
- JWT access + refresh tokens (15min / 7 days)
- Email & password validation
- Secure password hashing with bcrypt
- Protected routes middleware

### Workspace Management
- Create/update/delete workspaces
- Role-based access (OWNER, ADMIN, MEMBER)
- Invite/remove members
- Update member roles

### Project Management
- CRUD operations for projects within workspaces
- Project assignment to workspace members
- Role-based permissions

### Task Management
- Full CRUD with title, description, status, priority
- Task statuses: TODO, IN_PROGRESS, DONE
- Priority levels: LOW, MEDIUM, HIGH
- Assign tasks to members
- Due date tracking

### Comment System
- Add/edit/delete comments on tasks
- Chronological ordering
- Owner-only edits, role-based deletion

---

## Security Features

- **JWT Authentication**: Access + refresh token rotation
- **Password Security**: bcrypt (10 salt rounds), strong validation (8+ chars, uppercase, lowercase, number)
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Email, password strength, sanitized bodies

---

## Testing

**Test Coverage**: 56/58 tests passing (96.6%)

```bash
cd backend
npm test                    # Run all tests
npm test -- task.service    # Run specific test file
npm test -- comment         # Run all comment tests
```

- **Task Service**: 14/16 (88%)
- **Task Routes**: 15/15 (100%) ✨
- **Comment Service**: 12/12 (100%) ✨
- **Comment Routes**: 15/15 (100%) ✨

---

## 📡 API Endpoints

### Authentication
```http
POST   /auth/register
POST   /auth/login
POST   /auth/refresh-token
```

### Workspaces
```http
POST   /workspaces
GET    /workspaces
PUT    /workspaces/:workspaceId
DELETE /workspaces/:workspaceId
POST   /workspaces/:workspaceId/members
DELETE /workspaces/:workspaceId/members/:userId
PUT    /workspaces/:workspaceId/members/:userId
```

### Projects
```http
POST   /workspaces/:workspaceId/projects
GET    /workspaces/:workspaceId/projects
PUT    /workspaces/:workspaceId/projects/:projectId
DELETE /workspaces/:workspaceId/projects/:projectId
```

### Tasks
```http
POST   /workspaces/:workspaceId/projects/:projectId/tasks
GET    /workspaces/:workspaceId/projects/:projectId/tasks
PUT    /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
DELETE /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
```

### Comments
```http
POST   /workspaces/tasks/:taskId/comments
GET    /workspaces/tasks/:taskId/comments
PUT    /workspaces/comments/:commentId
DELETE /workspaces/comments/:commentId
```

---

##  Pending Features

### Activity Logs System
- Track all user actions (create, update, delete)
- Activity feed for workspaces and projects
- User activity history
- Audit trail for compliance
- Real-time activity notifications

### Task Filtering & Search
- Filter tasks by status, priority, assignee
- Search tasks by title and description
- Advanced query capabilities
- Saved filters

### Additional Features
- File attachments on tasks
- Task tags/labels
- Bulk task operations

---

## Documentation

- **[Backend Documentation](./backend/README.md)** - Detailed API docs, database schema, deployment
- **Frontend Documentation** - Coming soon

## Recent Updates

### Latest Changes (2025-12-09)
- ✅ Implemented authentication UI with login and registration pages
- ✅ Added React Context API for global authentication state
- ✅ Configured TailwindCSS for modern, responsive styling
- ✅ Set up protected routes with automatic redirects
- ✅ Integrated authentication API client with token management
- ✅ Updated Prisma schema for authentication models

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is for educational purposes.
