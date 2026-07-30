"""Runs the Renault manual scraper against a list of model/year combinations
taken from the real site, to validate that get_manual_renault finds the
correct link for each case.

get_manual_renault now resolves only by (model, year) -- no month -- and
takes the first manual for that year that appears on the site. That's why
_RAW_TEST_CASES (with month) gets reduced to one case per unique (model, year)
before running the tests: testing "Sandero" "03/2021" and "07/2021"
separately no longer makes sense, since both match the same pattern and
return the same link.

Usage (from the backend/ folder):
    uv run python -m web_scraping.run_manual_test
    uv run python -m web_scraping.run_manual_test --download
    uv run python -m web_scraping.run_manual_test --upload
"""
import argparse

from web_scraping.scraping import Web_Scraping

_RAW_TEST_CASES = [
    # -- "nuevo" line --
    ("Kwid", "05/2022"),
    ("Kwid", "05/2023"),
    ("Kwid", "10/2024"),
    ("Kwid", "01/2025"),
    ("Sandero", "09/2019"),
    ("Sandero", "01/2020"),
    ("Sandero", "07/2020"),
    ("Sandero", "03/2021"),
    ("Sandero", "07/2021"),
    ("Sandero", "12/2021"),
    ("Sandero", "06/2022"),
    ("Sandero", "10/2022"),
    ("Logan", "09/2019"),
    ("Logan", "01/2020"),
    ("Logan", "07/2020"),
    ("Logan", "03/2021"),
    ("Logan", "07/2021"),
    ("Logan", "12/2021"),
    ("Logan", "06/2022"),
    ("Logan", "10/2022"),
    ("Stepway", "09/2019"),
    ("Stepway", "01/2020"),
    ("Stepway", "07/2020"),
    ("Stepway", "03/2021"),
    ("Stepway", "07/2021"),
    ("Stepway", "12/2021"),
    ("Stepway", "06/2022"),
    ("Stepway", "10/2022"),
    # -- previous line (no "nuevo" prefix) --
    ("Kwid", "12/2018"),
    ("Kwid", "11/2019"),
    ("Kwid", "07/2020"),
    ("Kwid", "01/2021"),
    ("Kwid", "05/2021"),
    ("Sandero", "05/2015"),
    ("Sandero", "02/2016"),
    ("Sandero", "10/2016"),
    ("Sandero", "04/2017"),
    ("Sandero", "10/2017"),
    ("Sandero", "03/2018"),
    ("Sandero", "10/2018"),
    ("Logan", "05/2015"),
    ("Logan", "02/2016"),
    ("Logan", "10/2016"),
    ("Logan", "04/2017"),
    ("Logan", "10/2017"),
    ("Logan", "03/2018"),
    ("Logan", "10/2018"),
]

TEST_CASES = list(dict.fromkeys(
    (model, month_year.split("/")[-1]) for model, month_year in _RAW_TEST_CASES
))


def run(download: bool, upload: bool) -> None:
    ws = Web_Scraping(brand="renault", year="", model="")
    browser, page = ws.init_page()

    passed, failed = 0, 0
    try:
        for model, year in TEST_CASES:
            ws.model = model
            ws.year = year
            label = f"{model} {year}"
            try:
                link = ws.get_manual_renault(page)
                if download or upload:
                    path = ws.download_manual(page, link)
                    if upload:
                        key = ws.upload_manual(path, model, year)
                        print(f"OK   {label:<20} -> uploaded to s3://{key} (local copy deleted)")
                    else:
                        print(f"OK   {label:<20} -> downloaded to {path}")
                else:
                    href = link.get_attribute("href")
                    print(f"OK   {label:<20} -> {href}")
                passed += 1
            except Exception as exc:
                print(f"FAIL {label:<20} -> {exc}")
                failed += 1
    finally:
        browser.close()
        ws.close()

    print(f"\n{passed} ok, {failed} failed, {len(TEST_CASES)} total")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the Renault manual scraper")
    parser.add_argument(
        "--download",
        action="store_true",
        help="download each PDF instead of just resolving the link (slower)",
    )
    parser.add_argument(
        "--upload",
        action="store_true",
        help="download each PDF and upload it to the S3 bucket with brand/model/year (implies --download)",
    )
    args = parser.parse_args()
    run(args.download, args.upload)
    

