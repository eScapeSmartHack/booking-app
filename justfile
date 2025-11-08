# Justfile for FastAPI + Next.js Application
# Run 'just --list' to see all available commands

# Default recipe to display help
default:
    @just --list

# Install all dependencies (backend + frontend)
install: install-backend install-frontend

# Install backend dependencies
install-backend:
    @echo "📦 Installing backend dependencies..."
    cd backend && python3 -m venv venv
    cd backend && ./venv/bin/pip install -r requirements.txt
    @echo "✅ Backend dependencies installed!"

# Install frontend dependencies
install-frontend:
    @echo "📦 Installing frontend dependencies..."
    cd frontend && npm install
    @echo "✅ Frontend dependencies installed!"

# Set up environment files
setup-env:
    @echo "🔧 Setting up environment files..."
    @if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env && echo "✅ Created backend/.env"; else echo "⚠️  backend/.env already exists"; fi
    @if [ ! -f frontend/.env.local ]; then cp frontend/.env.local.example frontend/.env.local && echo "✅ Created frontend/.env.local"; else echo "⚠️  frontend/.env.local already exists"; fi

# Run both backend and frontend in parallel
run-all:
    @echo "🚀 Starting both backend and frontend..."
    just run-backend & just run-frontend

# Run only the backend
run-backend:
    @echo "🐍 Starting FastAPI backend on http://localhost:8000..."
    cd backend && ./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run only the frontend
run-frontend:
    @echo "⚛️  Starting Next.js frontend on http://localhost:3000..."
    cd frontend && npm run dev

# Build both backend and frontend
build: build-frontend
    @echo "✅ Build completed!"

# Build frontend for production
build-frontend:
    @echo "🏗️  Building frontend..."
    cd frontend && npm run build

# Clean all dependencies and build artifacts
clean:
    @echo "🧹 Cleaning up..."
    rm -rf backend/venv
    rm -rf backend/__pycache__
    rm -rf backend/app/__pycache__
    rm -rf backend/app/**/__pycache__
    rm -rf backend/*.db
    rm -rf frontend/node_modules
    rm -rf frontend/.next
    rm -rf frontend/out
    @echo "✅ Cleanup completed!"

# Run backend tests
test-backend:
    @echo "🧪 Running backend tests..."
    cd backend && ./venv/bin/pytest

# Run frontend tests
test-frontend:
    @echo "🧪 Running frontend tests..."
    cd frontend && npm test

# Run all tests
test: test-backend test-frontend

# Check backend code style
lint-backend:
    @echo "🔍 Linting backend code..."
    cd backend && ./venv/bin/python3 -m pip install black flake8 mypy
    cd backend && ./venv/bin/black --check app/
    cd backend && ./venv/bin/flake8 app/

# Check frontend code style
lint-frontend:
    @echo "🔍 Linting frontend code..."
    cd frontend && npm run lint

# Lint all code
lint: lint-backend lint-frontend

# Format backend code
format-backend:
    @echo "✨ Formatting backend code..."
    cd backend && ./venv/bin/python3 -m pip install black
    cd backend && ./venv/bin/black app/

# Format frontend code
format-frontend:
    @echo "✨ Formatting frontend code..."
    cd frontend && npm run lint -- --fix

# Format all code
format: format-backend format-frontend

# Run with Docker Compose
docker-up:
    @echo "🐳 Starting with Docker Compose..."
    docker-compose up --build

# Stop Docker Compose services
docker-down:
    @echo "🐳 Stopping Docker Compose services..."
    docker-compose down

# View logs for backend
logs-backend:
    @echo "📋 Viewing backend logs..."
    docker-compose logs -f backend

# View logs for frontend
logs-frontend:
    @echo "📋 Viewing frontend logs..."
    docker-compose logs -f frontend

# Health check for services
health:
    @echo "🏥 Checking service health..."
    @curl -s http://localhost:8000/health || echo "❌ Backend is not running"
    @curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend is running" || echo "❌ Frontend is not running"

# Complete setup (install + setup env)
setup: install setup-env
    @echo "🎉 Setup complete! Run 'just run-all' to start the application."

# Development workflow: clean, install, and run
dev: clean install setup-env run-all
