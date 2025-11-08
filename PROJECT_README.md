# FastAPI + Next.js Full-Stack Application

A modern full-stack application with FastAPI backend and Next.js frontend.

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── routes/     # Route handlers
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   └── .env.local.example # Environment variables template
│
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Run the development server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. Access the API:
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000

## Docker Setup (Optional)

Run both frontend and backend with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- Backend at http://localhost:8000
- Frontend at http://localhost:3000

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

### Items
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/{item_id}` - Get item by ID
- `POST /api/v1/items` - Create new item
- `PUT /api/v1/items/{item_id}` - Update item
- `DELETE /api/v1/items/{item_id}` - Delete item

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{user_id}` - Get user by ID
- `POST /api/v1/users` - Create new user

## Development

### Backend Development

The FastAPI backend uses:
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server
- **SQLAlchemy**: SQL toolkit and ORM (optional)

Key files:
- `app/main.py`: Application entry point
- `app/core/config.py`: Configuration management
- `app/api/routes/`: API route handlers

### Frontend Development

The Next.js frontend uses:
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React**: UI library

Key files:
- `src/app/page.tsx`: Home page
- `src/app/layout.tsx`: Root layout
- `src/lib/api.ts`: API client utilities
- `src/components/`: Reusable React components

## Environment Variables

### Backend (.env)
```
PROJECT_NAME="FastAPI Backend"
API_V1_STR="/api/v1"
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
DATABASE_URL="sqlite:///./app.db"
SECRET_KEY="your-secret-key"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

## Production Build

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm start
# or
yarn build
yarn start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
