"""Ejecuta el scraping de manuales de Renault contra una lista de combinaciones
modelo/año tomadas del sitio real, para validar que get_manual_renault encuentra
el link correcto en cada caso.

get_manual_renault ahora resuelve solo por (modelo, anio) -- sin mes -- y toma
el primer manual de ese anio que aparezca en el sitio. Por eso _RAW_TEST_CASES
(con mes) se reduce a un caso por (modelo, anio) unico antes de correr las
pruebas: probar "Sandero" "03/2021" y "07/2021" por separado ya no tiene
sentido, porque ambos matchean el mismo patron y devuelven el mismo link.

Uso (desde la carpeta backend/):
    uv run python -m web_scraping.run_manual_test
    uv run python -m web_scraping.run_manual_test --download
    uv run python -m web_scraping.run_manual_test --upload
"""
import argparse

from web_scraping.scraping import Web_Scraping

_RAW_TEST_CASES = [
    # -- linea "nuevo" --
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
    # -- linea anterior (sin prefijo "nuevo") --
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
                        print(f"OK   {label:<20} -> subido a s3://{key} (local eliminado)")
                    else:
                        print(f"OK   {label:<20} -> descargado en {path}")
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

    print(f"\n{passed} ok, {failed} fallidos, {len(TEST_CASES)} en total")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prueba el scraping de manuales de Renault")
    parser.add_argument(
        "--download",
        action="store_true",
        help="descarga cada PDF en vez de solo resolver el link (mas lento)",
    )
    parser.add_argument(
        "--upload",
        action="store_true",
        help="descarga cada PDF y lo sube al bucket S3 con brand/model/year (implica --download)",
    )
    args = parser.parse_args()
    run(args.download, args.upload)
    

