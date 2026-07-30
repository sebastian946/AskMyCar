"""Manual test of the full RAG pipeline (rag/): looks up the manual in S3 (if
missing, scrapes the manufacturer's site and uploads it), downloads it, splits
it into chunks, builds the retriever (Chroma + Ollama embeddings) and asks the
LLM a question (Anthropic if ANTHROPIC_API_KEY is set, otherwise Ollama).

--year is just the year (e.g. "2019", no month). If the manual isn't in S3,
it gets scraped and the first manual for that model/year found on the site
is used (regardless of month).

Usage (from the backend/ folder):
    uv run python -m rag.run_qa_test --model Sandero --year 2019 \
        --question "How often should the oil be changed?"
"""
import argparse

from config.config import get_llm
from rag.load_document import LoadManual
from rag.qa_chain import ManualQAChain


def run(brand: str, model: str, year: str, question: str) -> None:
    llm = get_llm()
    print(f"LLM: {type(llm).__name__} ({getattr(llm, 'model', '?')})")

    print(f"Loading manual: {brand}/{model}/{year} ...")
    try:
        retriever = LoadManual(brand, model, year).retriever()
        chain = ManualQAChain(retriever)
    except Exception as exc:
        print(f"FAIL loading/indexing the manual -> {exc}")
        raise SystemExit(1)
    print("Manual downloaded, split into chunks and indexed in Chroma: OK")

    docs = chain.retriever.invoke(question)
    if not docs:
        print("FAIL the retriever returned no chunks for the question")
        raise SystemExit(1)
    print(f"Chunks retrieved: {len(docs)}")
    for i, doc in enumerate(docs, 1):
        preview = doc.page_content[:200].replace("\n", " ")
        print(f"  [{i}] {preview}...")

    print(f"\nQuestion: {question}")
    answer = chain.text_prompt(question)
    if not answer or not answer.strip():
        print("FAIL the LLM returned an empty answer")
        raise SystemExit(1)
    print(f"Answer: {answer}")
    print("\nOK: full pipeline (S3 -> PDF -> split -> embeddings -> retriever -> LLM) worked end to end")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manual test of the RAG pipeline (rag/)")
    parser.add_argument("--brand", default="renault")
    parser.add_argument("--model", required=True, help="e.g. Sandero")
    parser.add_argument("--year", required=True, help="e.g. 2019 (year only, no month)")
    parser.add_argument("--question", default="Cada cuanto se debe cambiar el aceite del motor?")
    args = parser.parse_args()
    run(args.brand, args.model, args.year, args.question)
