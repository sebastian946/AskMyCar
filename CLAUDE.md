# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

AskMyCar has two parts:
- `backend/` — a Python service (only part implemented so far) that scrapes vehicle owner's manuals from manufacturer sites, stores them in S3, and answers questions about a manual via a RAG pipeline (LangChain + Chroma + Anthropic/Ollama).
- `frontend/` — currently empty, not yet started.

All work happens in `backend/` for now.

## Commands

Run everything from `backend/` using `uv` (dependency/lock file is `backend/pyproject.toml` / `backend/uv.lock`, Python 3.12 pinned in `.python-version`).

```bash
uv sync                                   # install dependencies
uv run python main.py                     # run the FastAPI app entrypoint (currently just prints "Hello from backend!")
uv run fastapi dev main.py                # run FastAPI with reload (from fastapi[standard]/fastapi-cli)
uv run playwright install chromium        # required once before running the scraper (Playwright browser binary)
uv run python -m web_scraping.run_manual_test          # dry-run: resolve manual links for the test case list
uv run python -m web_scraping.run_manual_test --download  # also download each PDF
uv run python -m web_scraping.run_manual_test --upload     # download + upload to S3, deletes local copy after
```

There is no test suite, linter, or formatter configured yet — `run_manual_test.py` is the closest thing to a test and is run manually against the live Renault site.

## Environment variables

Loaded via `python-dotenv`. `Config.__init__` (`backend/config/config.py`) reads these eagerly and raises `KeyError` if any are missing:
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`, `RENAULT_URL`.

Optional, read by `get_llm()`: `ANTHROPIC_API_KEY` (enables Claude), `ANTHROPIC_MODEL` (default `claude-sonnet-5`), `OLLAMA_MODEL` (default `llama3.2`, used when `ANTHROPIC_API_KEY` is absent).

The `.env` file lives at the **repo root**, not inside `backend/`. This works because `load_dotenv()` (no args) walks up from the caller's file location to find it — don't assume it must sit next to the Python files.

## Architecture

**`config/`** — shared config and AWS access, used by both the scraper and the RAG pipeline.
- `config.py`: `Config` class wraps the required env vars above and builds an S3 client (`get_s3_config`). Also exports the module-level `get_llm(temperature=0)`, the single place that decides Anthropic vs. Ollama — Anthropic is used only when `ANTHROPIC_API_KEY` is set, otherwise it falls back to a local Ollama model. Any code that needs an LLM should go through this function rather than instantiating `ChatAnthropic`/`ChatOllama` directly.
- `bucket_actions.py`: `upload_file(...)` stores a manual PDF at S3 key `{brand}/{model}/{year}/{name}.pdf`; `get_file_url(...)` returns a presigned GET URL for that same key layout. The key layout (brand/model/year/name) is the contract shared across the scraper and the loader — keep them in sync if it changes.

**`web_scraping/`** — Playwright-based scraper (`Web_Scraping` class in `scraping.py`) that opens a manufacturer's manual page, finds the matching model+year manual link via regex, downloads it, and uploads it through `bucket_actions.upload_file`. Currently only `brand == "renault"` is implemented (Chevrolet support was added then removed — see git history); other brands raise `ValueError` in `init_page`. Manual QA against the real site lives in `run_manual_test.py`, driven from a hardcoded `TEST_CASES` list of (model, year) pairs.

**`langchain/`** — the RAG pipeline for answering questions about an already-uploaded manual.
- `load_document.py`: `LoadManual(brand, model, year)` resolves the manual's presigned S3 URL via `config.bucket_actions.get_file_url`, loads it with `PyPDFLoader` (which natively handles S3/web URLs, downloading to a temp file), splits it with `RecursiveCharacterTextSplitter`, and builds a Chroma vector store with `OllamaEmbeddings` (embeddings are always local Ollama regardless of which chat LLM is selected — there's no Anthropic embedding option). `.retriever()` is the main entrypoint other code should call.
- `qa_chain.py`: `ManualQAChain(brand, model, year)` wraps a `LoadManual` retriever into a prompt | llm | output-parser chain (`text_prompt(question)` invokes it and returns the answer). The LLM comes from `config.get_llm()`.

**Import style note**: this codebase has no `__init__.py` files (implicit namespace packages) and no consistent import convention yet. `web_scraping/` is designed to run via `python -m web_scraping.<module>` from `backend/`, using absolute imports like `from config.config import Config`. `langchain/` currently uses bare same-directory imports (`from load_document import LoadManual`) and expects to be run/imported with `backend/langchain/` itself on `sys.path`. Be aware of which style a given module expects before adding new cross-module imports.

**Naming gotcha**: the `langchain/` directory is a local module, not the `langchain` pip package. A file or class named literally `langchain` inside it will shadow the real library when that file is run directly as a script (its own directory gets prepended to `sys.path[0]`) — this already happened once and was fixed by renaming `langchain.py` → `qa_chain.py`. Avoid reintroducing a module/class named exactly `langchain` in that directory.

`main.py` is currently a bare FastAPI app (`app = FastAPI()`) not yet wired to either the scraper or the RAG pipeline.
