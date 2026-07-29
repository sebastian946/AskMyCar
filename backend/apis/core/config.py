from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    api_key: str
    allowed_origins: str = "http://localhost:3000"
    max_page_size: int = 100

settings = Settings() # type:ignore