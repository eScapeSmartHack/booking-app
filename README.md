# Booking App

A full-stack desk and room booking application with team management, recreational chat features, and administrative controls.

## Tech Stack

### Backend
- **FastAPI** (0.109.0) - Modern Python web framework
- **Prisma** (0.15.0) - Type-safe ORM
- **SQLite** - Database
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python 3.11+**

### Frontend
- **Next.js** (14.1.0) - React framework
- **React** (18.2.0) - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** (7.3.5) - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React PDF** - PDF rendering for floor plans

### Development Tools
- **Just** - Task runner
- **Docker & Docker Compose** - Containerization

## Prerequisites

- Python 3.11 or higher
- Node.js 18+ and npm
- [Just](https://github.com/casey/just) (optional, but recommended for easier setup)
- Docker and Docker Compose (optional, for containerized deployment)

## Setup Instructions

### Option 1: Using Just (Recommended)

1. **Install Just** (if not already installed):
   ```bash
   # macOS
   brew install just
   
   # Linux
   curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to ~/bin
   ```

2. **Complete setup** (installs dependencies and sets up environment):
   ```bash
   just setup
   ```

3. **Start the application**:
   ```bash
   just run-all
   ```

This will start:
- Backend API at `http://localhost:8000`
- Frontend at `http://localhost:3000`

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**:
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up Prisma database**:
   ```bash
   prisma generate
   prisma db push
   ```

6. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend**:
   ```bash
   npm run dev
   ```

### Option 3: Docker Compose

1. **Start all services**:
   ```bash
   just docker-up
   # or
   docker-compose up --build
   ```

2. **Stop services**:
   ```bash
   just docker-down
   # or
   docker-compose down
   ```

## Available Just Commands

- `just setup` - Complete setup (install dependencies + environment files)
- `just install` - Install all dependencies
- `just run-all` - Run both backend and frontend
- `just run-backend` - Run only the backend
- `just run-frontend` - Run only the frontend
- `just build` - Build frontend for production
- `just test` - Run all tests
- `just lint` - Lint all code
- `just format` - Format all code
- `just clean` - Clean all dependencies and build artifacts
- `just docker-up` - Start with Docker Compose
- `just docker-down` - Stop Docker Compose services

## Demo Credentials

### Employee
- **Username:** `Mihai`
- **Password:** `employee_2`

### Employee
- **Username:** `Rebeca`
- **Password:** `employee_4`

### Manager
- **Username:** `manager_1`
- **Password:** `manager_1`

### Admin
- **Username:** `admin_1`
- **Password:** `admin_1`

## Project Structure

```
booking-app/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Core configuration
│   │   ├── models/   # Data models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   └── prisma/       # Prisma schema and database
├── frontend/         # Next.js frontend
│   └── src/
│       ├── app/      # Next.js app router pages
│       ├── components/ # React components
│       ├── services/  # API services
│       └── types/     # TypeScript types
└── docker-compose.yml # Docker configuration
```

## Features

- Desk and room booking system
- Team management
- Recreational chat for shared spaces
- User role management (Employee, Manager, Admin)
- Booking approvals workflow
- Statistics and analytics
- Floor plan visualization
- Avatar builder
- Points/rewards system

## Development

The application uses hot-reload for both backend and frontend during development. Changes to the code will automatically refresh the application.


