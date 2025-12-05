# Task Manager API

*A modern RESTful API for managing tasks, projects, and collaborative workspaces.*

Built with **Node.js**, **Express**, and **Prisma ORM** — designed for scalability, clean structure, and secure authentication.

---

## ⚙️ Tech Stack

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| **Node.js**    | Backend runtime (ES modules)      |
| **Express.js** | REST API framework                |
| **Prisma ORM** | Database toolkit (SQLite for dev) |
| **JWT**        | Token-based auth system           |
| **bcrypt**     | Password hashing                  |

---

## 📌 Project Status

### ✅ Completed Features – *Authentication System*

* ES6 module setup
* Prisma + SQLite database integration
* User registration & login
* Email & password validation
* Secure password hashing with **bcrypt**
* JWT Authentication

  * Access token (**15 min**)
  * Refresh token (**7 days**)
* Token refresh endpoint
* Auth middleware for protected routes
* Global error handling

---

### 🚧 Pending Features

* 📁 Workspace Management
* 📋 Project Management
* ✓ Task Management
* 💬 Comments System
* 🚀 Advanced Collaboration Features

---

 
## 📁 Project Structure

```
task-manager-api/
 ├─ prisma/
 │  ├─ schema.prisma
 │  ├─ migrations/
 │  └─ dev.db
 ├─ src/
 │  ├─ modules/
 │  │  ├─ auth/
 │  │  │  ├─ auth.controller.js
 │  │  │  ├─ auth.service.js
 │  │  │  ├─ auth.routes.js
 │  │  │  └─ auth.middleware.js
 │  │  ├─ workspaces/ (pending)
 │  │  ├─ projects/ (pending)
 │  │  ├─ tasks/ (pending)
 │  │  └─ comments/ (pending)
 │  ├─ database/
 │  │  └─ prisma.js
 │  ├─ shared/
 │  │  └─ validation.js
 │  ├─ app.js
 │  └─ server.js
 ├─ .env
 ├─ .gitignore
 ├─ package.json
 └─ README.md
```

---

## 🗄️ Database Schema

### **User**

| Field       | Type     | Description      |
| ----------- | -------- | ---------------- |
| `id`        | UUID     | Primary Key      |
| `email`     | String   | Required, unique |
| `password`  | String   | Hashed           |
| `createdAt` | DateTime | Timestamp        |

### **Workspace**

| Field       | Type     | Description    |
| ----------- | -------- | -------------- |
| `id`        | UUID     | Primary Key    |
| `name`      | String   | Workspace name |
| `ownerId`   | String   | FK → User      |
| `createdAt` | DateTime | Timestamp      |

### **WorkspaceMember**

| Field         | Type   | Description            |
| ------------- | ------ | ---------------------- |
| `id`          | UUID   | Primary Key            |
| `userId`      | String | FK → User              |
| `workspaceId` | String | FK → Workspace         |
| `role`        | Enum   | OWNER / ADMIN / MEMBER |

### **Upcoming Models**

* **Project** – project management
* **Task** – task tracking
* **Comment** – discussions
* **Attachment** – file uploads

---

## 🔒 Security Features

### 🔑 Authentication

* JWT Access + Refresh tokens
* Strict token expiration
* Protected routes middleware

### 🛡️ Password Security

* Bcrypt hashing (10 salt rounds)
* Strong password validation

### ✔️ Input Validation

* Email validation
* Password strength check
* Sanitized request bodies

---

## 🧪 Development Commands

| Command                  | Description                |
| ------------------------ | -------------------------- |
| `npm run dev`            | Start dev server (nodemon) |
| `npm start`              | Production server          |
| `npx prisma generate`    | Generate Prisma Client     |
| `npx prisma migrate dev` | Apply migrations           |
| `npx prisma studio`      | DB GUI                     |

---
 
