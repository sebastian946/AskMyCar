# AskMyCar

AskMyCar scrapes vehicle owner's manuals from manufacturer sites, stores them in S3, and answers questions about a manual through a RAG (Retrieval-Augmented Generation) pipeline, exposed over an HTTP API.

**Project status:** `backend/` is implemented. `frontend/` is empty — not started yet.

## How it works

1. **Scraping** (`backend/web_scraping/`) — a Playwright-driven scraper (`Web_Scraping`) opens the manufacturer's manual page, finds the link matching a given model + year (currently only `brand == "renault"` is supported), downloads the PDF, and uploads it to S3.
2. **Storage** (`backend/config/bucket_actions.py`) — manuals are stored in S3 under the key `{brand}/{model}/{year}/{name}.pdf`. Looking a manual up (`get_file_url`) lists the objects under `{brand}/{model}/{year}/` and returns a presigned URL for the one found — there's no need to know the exact original filename.
3. **RAG pipeline** (`backend/rag/`) — `LoadManual` resolves the manual's presigned URL, loads the PDF (`PyPDFLoader`, which handles S3/web URLs natively), splits it into chunks (`RecursiveCharacterTextSplitter`), and embeds them locally with Ollama into a Chroma vector store. If the manual isn't in S3 yet, `LoadManual` triggers the scraper automatically and retries. `ManualQAChain` wraps the resulting retriever into a prompt → LLM → parser chain and returns both the answer and the manual excerpts (`sources`) used to produce it.
4. **LLM selection** (`backend/config/config.py::get_llm`) — a single place decides which chat model to use: **Anthropic (Claude) if `ANTHROPIC_API_KEY` is set, otherwise a local Ollama model.** Embeddings are always local Ollama regardless of which chat LLM is active (there's no Anthropic embedding option). Both backends are traced end-to-end in **LangSmith** automatically, with no provider-specific code — tracing works at the LangChain callback level, so it's identical for Claude and Ollama.
5. **API** (`backend/apis/`) — a FastAPI router (mounted in `main.py`) exposes the above over HTTP, protected by an API key header and per-route rate limiting.

## Environment variables

The `.env` file lives at the **repo root** (`AskMyCar/.env`), not inside `backend/`. `python-dotenv` walks up from the caller's location to find it, so this works regardless of whether you run things from `backend/` or elsewhere.

| Variable | Required | Purpose |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | Yes | S3 access |
| `AWS_SECRET_ACCESS_KEY` | Yes | S3 access |
| `AWS_REGION` | Yes | S3 region |
| `S3_BUCKET_NAME` | Yes | Bucket where manuals are stored |
| `RENAULT_URL` | Yes | Manufacturer manuals page the scraper opens |
| `API_KEY` | Yes | Shared secret clients must send in the `X-API-KEY` header to call the API |
| `ANTHROPIC_API_KEY` | No | When set, chat responses use Claude instead of Ollama |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5` |
| `OLLAMA_MODEL` | No | Defaults to `llama3.2`; used only when `ANTHROPIC_API_KEY` is absent |
| `LANGSMITH_TRACING` | No | `true` to enable LangSmith tracing for every LLM call (either backend) |
| `LANGSMITH_API_KEY` | No | Required if `LANGSMITH_TRACING=true` |
| `LANGSMITH_ENDPOINT` | No | LangSmith API endpoint |
| `LANGSMITH_PROJECT` | No | LangSmith project name traces are grouped under |
| `ALLOWED_ORIGINS` | No | Read into settings but not wired to any CORS middleware yet |

Embeddings also need a local **Ollama** server running with the `mxbai-embed-large` model pulled, independent of which chat LLM you use.

## Running it

From `backend/`, using `uv`:

```bash
uv sync                                    # install dependencies
uv run playwright install chromium         # one-time: Playwright browser binary
uv run fastapi dev main.py                 # start the API with reload, http://127.0.0.1:8000
```

Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs` — use the "Authorize" button to set `X-API-KEY`.

Manual test scripts (no automated test suite exists yet):

```bash
uv run python -m web_scraping.run_manual_test [--download] [--upload]   # scraper against the real site
uv run python -m rag.run_qa_test --model Sandero --year 2019 --question "..."  # full RAG pipeline
```

## API

Both endpoints require the `X-API-KEY` header and are rate-limited to 10 requests/minute per client.

**`POST /askmycar/get_manual`** — ensures a manual is in S3, scraping it if missing.

```bash
curl -X POST http://127.0.0.1:8000/askmycar/get_manual \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <your key>" \
  -d '{"brand": "renault", "model": "Sandero", "year": "2019"}'
```
```json
{ "status": "found", "car": {"brand": "renault", "model": "Sandero", "year": "2019"}, "message": "..." }
```

**`POST /askmycar/chat_ai`** — asks a question about a manual (scraping it first if needed).

```bash
curl -X POST http://127.0.0.1:8000/askmycar/chat_ai \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <your key>" \
  -d '{"car": {"brand": "renault", "model": "Sandero", "year": "2019"}, "question": "Cada cuanto se cambia el aceite?"}'
```
```json
{
  "car": {"brand": "renault", "model": "Sandero", "year": "2019"},
  "question": "Cada cuanto se cambia el aceite?",
  "answer": "...",
  "sources": ["excerpt from the manual...", "..."]
}
```

`year` is validated as a 4-digit year only (e.g. `"2019"`) — no month. If several manuals exist for the same model/year (different months), the scraper takes the first one found on the site.

## Notes / known limitations

- Only `brand == "renault"` is implemented in the scraper; other brands raise a clear error.
- No automated test suite, linter, or formatter configured — the `run_manual_test.py` / `run_qa_test.py` scripts are manual/integration checks run against the real site, S3, and LLM backends.
- `frontend/` hasn't been started.
- `ALLOWED_ORIGINS` / `max_page_size` are declared in the API settings but not yet used by any middleware.
