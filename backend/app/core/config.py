from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Backend"
    API_V1_STR: str = ""
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
