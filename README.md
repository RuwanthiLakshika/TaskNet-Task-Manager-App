# TaskNet Task Manager

TaskNet is a small full-stack task management application built as a learning project. The main goal was to learn the Angular ecosystem and compare its patterns with the React experience I already have, while also practicing how a frontend communicates with a Node.js API and a relational database.

The application supports the basic task workflow:

- View tasks, newest first
- Create a task with a title and optional description
- Update a task's title, description, and completion state
- Delete a task

## Why This Project?

I work primarily with React, so this project provides a practical way to learn Angular by building a familiar feature rather than studying isolated examples. The task manager covers the core concepts needed to become productive with Angular:

- Standalone Angular components
- Angular templates and component communication
- Forms and user input
- Dependency injection and services
- `HttpClient` and RxJS observables
- TypeScript models and typed API requests
- Angular CLI development and testing commands

The backend makes the exercise more complete by adding REST API design, request validation, Prisma data access, and MySQL persistence.

## Technology Stack

### Frontend

- **Angular 22**: Builds the browser application using standalone components.
- **TypeScript**: Adds types for components, task models, and API request objects.
- **Angular Forms**: Handles task creation and editing input.
- **Angular HttpClient**: Sends requests to the Express API.
- **RxJS**: Represents asynchronous HTTP operations as observables.
- **Vitest and Angular testing tools**: Support component and service tests.

### Backend

- **Node.js**: Runs the server-side JavaScript application.
- **Express 5**: Provides the HTTP server, middleware, health endpoint, and task routes.
- **CORS**: Allows the Angular development server to call the backend during local development.
- **dotenv**: Loads the database connection string from the root `.env` file.

### Data Layer

- **MySQL**: Stores task records in a relational database.
- **Prisma 7**: Defines the data model and provides a typed database client.
- **MariaDB adapter**: Allows Prisma to connect to the MySQL-compatible database through `@prisma/adapter-mariadb`.

## Project Structure

```text
TaskNet-Task-Manager-App/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Prisma data model
│   ├── src/
│   │   ├── config/prisma.js    # Database client configuration
│   │   ├── controllers/        # Task request handlers
│   │   ├── routes/             # Express route definitions
│   │   ├── app.js              # Middleware and API routes
│   │   └── server.js           # HTTP server startup
│   ├── package.json
│   └── prisma.config.ts
├── frontend/
│   ├── src/app/features/tasks/
│   │   ├── components/         # Task form and task list components
│   │   ├── models/             # TypeScript task interfaces
│   │   └── services/           # Angular API service
│   ├── angular.json
│   └── package.json
└── README.md
```

## How the Application Works

1. The user interacts with the Angular task form or task list.
2. `TaskService` sends an HTTP request to the Express API.
3. Express parses the request and routes it to a task controller.
4. The controller validates the request and calls Prisma.
5. Prisma executes the corresponding query against MySQL.
6. The API returns JSON, and Angular updates the displayed task list.

## Database Model

The `Task` model is mapped to the `tasks` table:

| Field | Type | Description |
| --- | --- | --- |
| `id` | Integer | Auto-incrementing primary key |
| `title` | String | Required task title, up to 255 characters |
| `description` | Text | Optional task description |
| `completed` | Boolean | Completion state, defaults to `false` |
| `createdAt` | DateTime | Creation timestamp, mapped to `created_at` |

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- Git

Create a MySQL database named `task_management`, or use another database name and update the connection string accordingly.

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd TaskNet-Task-Manager-App
```

### 2. Configure the database

Create a `.env` file in the repository root. The backend reads it from there:

```env
DATABASE_URL="mysql://root:root@localhost:3306/task_management"
```

Change the username, password, host, port, or database name to match your MySQL installation.

### 3. Install backend dependencies

```bash
cd backend
npm install
npx prisma generate
```

Apply the Prisma schema to the database using the migration workflow configured for the project:

```bash
npx prisma migrate dev --name init
```

Return to the repository root after the backend setup:

```bash
cd ..
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the Application

Open two terminal windows.

### Start the backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:3000`.

### Start the frontend

```bash
cd frontend
npm start
```

Angular typically serves the application at `http://localhost:4200`.

The frontend expects the API at:

```text
http://localhost:3000/api/tasks
```

## API Reference

### Health check

```http
GET /api/health
```

Example response:

```json
{
  "message": "Backend is running"
}
```

### List tasks

```http
GET /api/tasks
```

Returns tasks ordered by creation date, newest first.

### Create a task

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
  "title": "Learn Angular services",
  "description": "Practice dependency injection and HttpClient"
}
```

The title is required. A successful request returns `201 Created`.

### Update a task

```http
PUT /api/tasks/:id
Content-Type: application/json
```

Request body:

```json
{
  "title": "Learn Angular services",
  "description": "Practice dependency injection, HttpClient, and RxJS",
  "completed": true
}
```

### Delete a task

```http
DELETE /api/tasks/:id
```

Returns `204 No Content` when the task is deleted.

## Available Commands

### Backend

Run these commands from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the backend with Node.js |
| `npm run dev` | Start the backend with Nodemon |
| `npx prisma generate` | Generate the Prisma client |
| `npx prisma migrate dev --name <name>` | Create and apply a development migration |
| `npx prisma studio` | Open Prisma Studio for browsing data |

### Frontend

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Create a production build |
| `npm run watch` | Rebuild automatically during development |
| `npm test` | Run frontend tests |

## What I Learned

This project is intended as a practical Angular introduction. The main comparisons with React are:

- Angular provides a structured application framework, while React is primarily a UI library.
- Angular services and dependency injection provide a built-in pattern for shared logic and API access.
- Angular templates use Angular binding syntax instead of JSX.
- Angular `HttpClient` commonly returns RxJS observables, whereas React projects often use promises with `fetch` or a request library.
- Angular standalone components can declare their dependencies directly, reducing the need for traditional NgModules.
- Angular CLI commands provide conventions for generating, building, serving, and testing application code.

The backend also helped reinforce how frontend frameworks fit into a larger application: the UI, HTTP API, ORM, and database each have separate responsibilities and communicate through explicit contracts.

## Future Improvements

Possible next steps for the project include:

- Move the frontend API URL into an Angular environment configuration.
- Add stronger request validation and centralized error handling.
- Add loading, empty, and error states to the UI.
- Add filtering, sorting, and task search.
- Add authentication and user-specific task lists.
- Add backend integration tests and more Angular component tests.
- Add Docker configuration for the frontend, backend, and MySQL database.
- Add a deployment workflow for a hosted environment.

## License

This project is a personal learning project.