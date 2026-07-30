from apis.models.car_model import Car
from config.bucket_actions import get_file_url
from web_scraping.scraping import Web_Scraping
from rag.load_document import LoadManual
from rag.qa_chain import ManualQAChain

def get_manual(data:Car) -> dict:
    brand = data.brand
    year = data.year
    model = data.model

    try:
        get_file_url(brand, model, year)
        return {
            "status": "found",
            "message": f"El manual de {brand} {model} {year} ya estaba disponible en S3",
        }
    except FileNotFoundError:
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
    return qa_manual.ask(question)