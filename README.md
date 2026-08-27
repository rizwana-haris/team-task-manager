# Team Project & Task Management Application

A full-stack web application for managing team projects and tasks. The application supports two roles: **Admin** and **Team Member**.

## Features

### Admin

- Create projects
- Update and delete projects
- Add team members
- Create tasks
- Assign tasks to team members
- Set task priorities and deadlines
- Update tasks
- Delete tasks
- View project progress

### Team Member

- View assigned tasks
- View task details
- Update task status
- Add progress updates
- View task deadlines
- View task priorities

### Additional Features

- User authentication
- Role-based access control
- JWT-based authorization
- Form validation
- API error handling
- Project progress calculation
- Task progress updates
- Deadline change history

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
team-task-manager/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── dashboard/
│       │   ├── projects/
│       │   ├── tasks/
│       │   └── teamMembers/
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   └── Dashboard.tsx
│       ├── services/
│       │   ├── api.ts
│       │   ├── projectService.ts
│       │   ├── taskService.ts
│       │   └── userService.ts
│       ├── App.tsx
│       ├── App.css
│       ├── index.css
│       └── main.tsx
│
├── server/
│   └── src/
│       ├── config/
│       │   └── db.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── projectController.ts
│       │   ├── taskController.ts
│       │   └── userController.ts
│       ├── middleware/
│       │   ├── authMiddleware.ts
│       │   └── roleMiddleware.ts
│       ├── models/
│       │   ├── User.ts
│       │   ├── Project.ts
│       │   └── Task.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── projectRoutes.ts
│       │   ├── taskRoutes.ts
│       │   └── userRoutes.ts
│       ├── types/
│       │   └── express.d.ts
│       ├── utils/
│       │   └── jwt.ts
│       └── server.ts
│
└── README.md
```

## Installation

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

## Backend Setup

### Step 1: Open the server folder

```bash
cd server
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create the environment file

Create a file named:

```text
.env
```

inside the `server` folder.

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your actual MongoDB connection string and JWT secret.

### Step 4: Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

### Step 1: Open a new terminal

Keep the backend terminal running.

From the project root:

```bash
cd client
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the frontend

```bash
npm run dev
```

The frontend will run on the Vite development server, usually:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get logged-in user |
| GET | `/api/auth/admin` | Admin-only route |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get project by ID |
| GET | `/api/projects/:id/progress` | Get project progress |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/tasks/:id/progress` | Add progress update |

### Team Members

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user` | Create a team member |
| GET | `/api/user/team-members` | Get team members |

## Authentication

The application uses **JWT-based authentication**.

Protected API endpoints require a valid JWT token.

Role-based access control is implemented for:

- Admin
- Team Member

Admin-only operations include project management, team member management, task creation, and task deletion.

## Environment Variables

The backend requires the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

## Git Ignore

The following files and folders should be ignored by Git:

```text
node_modules/
.env
dist/
```

## Running the Application

Open **two terminals**.

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Then open the frontend URL shown by Vite in your browser.

## Future Improvements

- Task filtering and sorting
- Dashboard statistics
- Improved UI/UX
- Notifications
- Search functionality
- Pagination
- Production deployment

## License

This project is developed as a full-stack web application project.