import logging

from config.bucket_actions import get_file_url
from config.config import get_embeddings
from web_scraping.scraping import Web_Scraping
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

logger = logging.getLogger(__name__)

class LoadManual:
    def __init__(self,brand,model,year) -> None:
        self.brand = brand
        self.model = model
        self.year = year

    def get_document(self):
        try:
            return get_file_url(self.brand, self.model, self.year)
        except FileNotFoundError:
            logger.info(f"Manual not found in S3, scraping: {self.brand}/{self.model}/{self.year} ...")
            scraper = Web_Scraping(brand=self.brand, year=self.year, model=self.model)
            scraper.scrape_and_upload()
            return get_file_url(self.brand, self.model, self.year)

    def load_document(self):
        url = self.get_document()
        loader = PyPDFLoader(
            file_path=url,
            mode="single",
            pages_delimiter=""
        )
        docs = loader.load()
        return docs

    def split_text(self):
        docs = self.load_document()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )

        splits = text_splitter.split_documents(docs)
        return splits

    def retriever(self):
        splits = self.split_text()
        embedding = get_embeddings()
        vector_store = Chroma.from_documents(documents=splits, embedding=embedding)
        retriever = vector_store.as_retriever(search_kwargs={"k":3})
        return retriever

