"""Prueba manual del pipeline RAG completo (rag/): busca el manual en S3 (si no
esta, hace scraping del sitio del fabricante y lo sube), lo descarga, lo parte
en chunks, arma el retriever (Chroma + embeddings de Ollama) y le hace una
pregunta al LLM (Anthropic si hay ANTHROPIC_API_KEY, si no Ollama).

El --year es solo el anio (ej. "2019", sin mes). Si el manual no esta en S3,
se hace scraping y se toma el primer manual de ese modelo/anio que aparezca
en el sitio (sin importar el mes).

Uso (desde la carpeta backend/):
    uv run python -m rag.run_qa_test --model Sandero --year 2019 \
        --question "Cada cuanto se cambia el aceite?"
"""
import argparse

from config.config import get_llm
from rag.load_document import LoadManual
from rag.qa_chain import ManualQAChain


def run(brand: str, model: str, year: str, question: str) -> None:
    llm = get_llm()
    print(f"LLM: {type(llm).__name__} ({getattr(llm, 'model', '?')})")

    print(f"Cargando manual: {brand}/{model}/{year} ...")
    try:
        retriever = LoadManual(brand, model, year).retriever()
        chain = ManualQAChain(retriever)
    except Exception as exc:
        print(f"FAIL al cargar/indexar el manual -> {exc}")
        raise SystemExit(1)
    print("Manual descargado, dividido en chunks e indexado en Chroma: OK")

    docs = chain.retriever.invoke(question)
    if not docs:
        print("FAIL el retriever no devolvio ningun chunk para la pregunta")
        raise SystemExit(1)
    print(f"Chunks recuperados: {len(docs)}")
    for i, doc in enumerate(docs, 1):
        preview = doc.page_content[:200].replace("\n", " ")
        print(f"  [{i}] {preview}...")

    print(f"\nPregunta: {question}")
    answer = chain.text_prompt(question)
    if not answer or not answer.strip():
        print("FAIL el LLM devolvio una respuesta vacia")
        raise SystemExit(1)
    print(f"Respuesta: {answer}")
    print("\nOK: pipeline completo (S3 -> PDF -> split -> embeddings -> retriever -> LLM) funciono end to end")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prueba manual del pipeline RAG (rag/)")
    parser.add_argument("--brand", default="renault")
    parser.add_argument("--model", required=True, help="ej. Sandero")
    parser.add_argument("--year", required=True, help="ej. 2019 (solo el anio, sin mes)")
    parser.add_argument("--question", default="Cada cuanto se debe cambiar el aceite del motor?")
    args = parser.parse_args()
    run(args.brand, args.model, args.year, args.question)
