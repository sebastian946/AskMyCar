import logging

from apis.models.car_model import Car
from config.bucket_actions import get_file_url
from web_scraping.scraping import Web_Scraping
from rag.load_document import LoadManual
from rag.qa_chain import ManualQAChain

logger = logging.getLogger(__name__)

def get_manual(data:Car) -> dict:
    brand = data.brand
    year = data.year
    model = data.model

    try:
        get_file_url(brand, model, year)
        logger.info(f"Manual already in S3: {brand}/{model}/{year}")
        return {
            "status": "found",
            "message": f"El manual de {brand} {model} {year} ya estaba disponible en S3",
        }
    except FileNotFoundError:
        logger.info(f"Manual not in S3, scraping: {brand}/{model}/{year}")
        scraping = Web_Scraping(brand, year, model)
        key = scraping.scrape_and_upload()
        return {
            "status": "scraped",
            "message": f"Manual descargado y subido a S3: {key}",
        }


def prompt_ai(data:Car,question:str) -> dict:
    brand = data.brand
    year = data.year
    model = data.model
    load_manual = LoadManual(brand,model,year)
    retriever = load_manual.retriever()
    qa_manual = ManualQAChain(retriever)
    result = qa_manual.ask(question)
    logger.info(f"Answered question for {brand}/{model}/{year} ({len(result['sources'])} sources)")
    return result