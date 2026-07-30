import os
import re

from playwright.sync_api import sync_playwright
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from config.config import Config
from config.bucket_actions import upload_file

class Web_Scraping:
    def __init__(self, brand:str, year:str, model:str) -> None:
        self.brand = brand
        self.model = model
        self.year = year
        self.p = sync_playwright().start()
        self.config = Config()
        self.renault_url = self.config.get_reanult_url()

    def init_page(self):
        if self.brand == "renault":
            url = self.renault_url
        else:
            raise ValueError(f"Unsupported brand: {self.brand}")

        browser = self.p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        try:
            page.locator("#onetrust-accept-btn-handler").click(timeout=5000)
        except PlaywrightTimeoutError:
            pass

        return browser, page

    def get_manual_renault(self, page):
        pattern = re.compile(rf"{re.escape(self.model)}\s+\d{{1,2}}/{re.escape(self.year)}", re.IGNORECASE)
        card = page.get_by_text(pattern).first
        link = card.locator(":scope > a")
        return link


    def download_manual(self, page, link):
        with page.expect_download() as download_info:
            link.click()
        download = download_info.value
        os.makedirs("download", exist_ok=True)
        path = f"download/{download.suggested_filename}"
        download.save_as(path)
        return path

    def upload_manual(self, path, model, year):
        name = os.path.splitext(os.path.basename(path))[0]
        key = upload_file(
            brand=self.brand,
            model=model,
            year=year,
            name=name,
            file_path=path,
            content_type="application/pdf",
        )
        os.remove(path)
        return key

    def scrape_and_upload(self) -> str:
        browser, page = self.init_page()
        try:
            link = self.get_manual_renault(page)
            path = self.download_manual(page, link)
            key = self.upload_manual(path, self.model, self.year)
        finally:
            browser.close()
            self.close()
        return key

    def close(self):
        self.p.stop()
