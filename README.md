# Task Manager API

A robust RESTful API for managing tasks, projects, and team workspaces with secure authentication.

## Features

### Implemented
- User Authentication
  - User registration with email/password validation
  - Secure login with JWT tokens (access + refresh tokens)
  - Token refresh mechanism
  - Password encryption with bcrypt
  - Input validation (email format, password strength)

- Workspace Management
  - Create workspaces
  - Role-based access (Owner, Admin, Member)
  - User workspace membership

### Planned Features
- Project Management
  - Create and manage projects within workspaces
  - Project ownership and permissions
  - Project status tracking

- Task Management
  - Create, update, and delete tasks
  - Assign tasks to team members
  - Task status (Todo, In Progress, Done)
  - Task priorities and due dates
  - Task comments and attachments

- Team Collaboration
  - Invite members to workspaces
  - Assign roles and permissions
  - Activity tracking and notifications

- Advanced Features
  - Task filtering and search
  - Task dependencies
  - Time tracking
  - File uploads for task attachments
  - Real-time updates via WebSocket
  - Email notifications

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Custom validators + Zod

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-manager-api

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"

# Server Port (optional)
PORT=5000
```

**Important**: Change the JWT secrets in production!

### 3. Database Setup

```bash
# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Workspaces

#### Create Workspace (Protected)
```http
POST /workspaces
Content-Type: application/json
Authorization: Bearer <access-token>

{
  "name": "My Team Workspace"
}
```

## Project Structure

```
task-manager-api/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   └── dev.db              # SQLite database file
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.middleware.ts
│   │   ├── workspaces/     # Workspace management
│   │   ├── projects/       # (Planned) Project management
│   │   ├── tasks/          # (Planned) Task management
│   │   └── comments/       # (Planned) Task comments
│   ├── database/
│   │   └── prisma.ts       # Prisma client singleton
│   ├── shared/
│   │   ├── middleware/     # Shared middleware
│   │   └── utils/          # Utility functions
│   │       └── validation.ts
│   ├── types/
│   │   └── express.d.ts    # TypeScript type definitions
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npx tsc --noEmit

# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>
```

### Code Style

- ES Modules (type: "module")
- TypeScript strict mode enabled
- Import paths must include `.js` extension
- Use `import type` for type-only imports

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Separate access (15min) and refresh (7d) tokens
- Input validation on all endpoints
- Protected routes with authentication middleware
- SQL injection protection (Prisma ORM)

## Testing

```bash
# Test registration
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Test login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

See [TEST_GUIDE.md](TEST_GUIDE.md) for comprehensive testing instructions.

## Roadmap

### Phase 1: Core Features (Current)
- [x] User authentication
- [x] Workspace creation
- [ ] Project management
- [ ] Basic task CRUD operations

### Phase 2: Collaboration
- [ ] Workspace invitations
- [ ] Role-based permissions
- [ ] Task assignments
- [ ] Comments system

### Phase 3: Advanced Features
- [ ] File uploads
- [ ] Real-time updates
- [ ] Email notifications
- [ ] Task dependencies
- [ ] Time tracking

### Phase 4: Polish & Optimization
- [ ] Comprehensive test suite
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting
- [ ] Logging and monitoring
- [ ] Performance optimization

## Database Schema

### Current Models

- **User**: Email, password, workspaces
- **Workspace**: Name, owner, members
- **WorkspaceMember**: User-workspace relationship with roles
- **Role**: OWNER, ADMIN, MEMBER (enum)

### Planned Models

- **Project**: Title, description, workspace, tasks
- **Task**: Title, description, status, priority, assignee, project
- **Comment**: Content, author, task
- **Attachment**: File metadata, task

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.

---

**Status**: In Development

Current Focus: Implementing project and task management features
