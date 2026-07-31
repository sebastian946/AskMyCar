from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    api_key: str
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    max_page_size: int = 100

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

settings = Settings() # type:ignore