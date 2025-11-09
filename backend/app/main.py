from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router
from pydantic import BaseModel
from app.services.database_service import db_service
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_service.connect()
    yield
    await db_service.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


    

