from apis.models.car_model import Car
from config.bucket_actions import get_file_url
from web_scraping.scraping import Web_Scraping
from rag.load_document import LoadManual
from rag.qa_chain import ManualQAChain

def get_manual(data:Car) -> str:
    brand = data.brand
    year = data.year
    model = data.model
    s3_year = year.replace("/", "-")

    try:
        get_file_url(brand, model, s3_year)
        return f"El manual de {brand} {model} {year} ya estaba disponible en S3"
    except FileNotFoundError:
        scraping = Web_Scraping(brand, year, model)
        key = scraping.scrape_and_upload()
        return f"Manual descargado y subido a S3: {key}"


def prompt_ai(data:Car,question:str) -> str:
    brand = data.brand
    year = data.year
    model = data.model
    load_manual = LoadManual(brand,model,year)
    retriever = load_manual.retriever()
    qa_manual = ManualQAChain(retriever)
    response = qa_manual.text_prompt(question)
    return response