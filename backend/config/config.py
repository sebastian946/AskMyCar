import os
from dotenv import load_dotenv
import boto3
from langchain_anthropic import ChatAnthropic
from langchain_ollama import ChatOllama

class Config:
    def __init__(self) -> None:
        load_dotenv()
        self.AWS_ACCESS_KEY=os.environ["AWS_ACCESS_KEY_ID"]
        self.AWS_SECRET_ACCESS = os.environ["AWS_SECRET_ACCESS_KEY"]
        self.AWS_REGION = os.environ["AWS_REGION"]
        self.S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]
        self.RENAULT_URL = os.environ["RENAULT_URL"]

    def get_s3_config(self):
        s3 = boto3.client(
            "s3",
            region_name = self.AWS_REGION,
            aws_access_key_id = self.AWS_ACCESS_KEY,
            aws_secret_access_key = self.AWS_SECRET_ACCESS
        )
        return s3

    def get_bucket_name(self):
        return self.S3_BUCKET_NAME

    def get_reanult_url(self):
        return self.RENAULT_URL


def get_llm(temperature: float = 0):
    """Devuelve ChatAnthropic si hay credenciales de Anthropic en el entorno; si no, cae a Ollama local."""
    load_dotenv()
    if os.environ.get("ANTHROPIC_API_KEY"):
        model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5")
        # No se pasa `temperature`: los modelos Claude 5 lo rechazan (400 Bad Request).
        return ChatAnthropic(model=model)

    model = os.environ.get("OLLAMA_MODEL", "llama3.2")
    return ChatOllama(model=model, temperature=temperature)
