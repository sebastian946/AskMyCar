# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

AskMyCar scrapes vehicle owner's manuals from manufacturer sites, stores them in S3, and answers questions about a manual via a RAG pipeline, exposed over an HTTP API and consumed by a React frontend.

- `backend/` — Python service: scraper, RAG pipeline, FastAPI API.
- `frontend/` — React 19 + TypeScript + Vite + Tailwind v4 SPA. UI/design layer is built; the API integration layer (`src/api/`) is being wired up incrementally by the user.

## Commands

### Backend

Run everything from `backend/` using `uv` (dependency/lock file is `backend/pyproject.toml` / `backend/uv.lock`, Python 3.12 pinned in `.python-version`).

```bash
uv sync                                   # install dependencies
uv run fastapi dev main.py                # run the API with reload, http://127.0.0.1:8000 (docs at /docs)
uv run playwright install chromium        # required once before running the scraper (Playwright browser binary)
uv run python -m web_scraping.run_manual_test          # dry-run: resolve manual links for the test case list
uv run python -m web_scraping.run_manual_test --download  # also download each PDF
uv run python -m web_scraping.run_manual_test --upload     # download + upload to S3, deletes local copy after
uv run python -m rag.run_qa_test --model Sandero --year 2019 --question "..."  # manual test of the full RAG pipeline
```

There is no automated test suite, linter, or formatter configured for the backend — `run_manual_test.py` and `run_qa_test.py` are manual/integration checks run against the real site, S3, and LLM backends.

Note: `fastapi dev`'s startup banner can crash with `UnicodeEncodeError` on a non-UTF-8 Windows console (cp1252 can't encode the emoji it prints). Not a code bug — run with `PYTHONUTF8=1` set, or use a UTF-8 terminal.

### Frontend

Run from `frontend/` using `npm`:

```bash
npm install
npm run dev       # Vite dev server with reload, default http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint
```

## Environment variables

Loaded via `python-dotenv` on the backend. `Config.__init__` (`backend/config/config.py`) reads these eagerly and raises `KeyError` if any are missing:
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`, `RENAULT_URL`.

Required by the API layer (`apis/core/config.py`): `API_KEY` (shared secret clients send as `X-API-KEY`).

Optional: `ANTHROPIC_API_KEY` (enables Claude via `get_llm()`), `ANTHROPIC_MODEL` (default `claude-sonnet-5`), `OLLAMA_MODEL` (default `llama3.2`, used when `ANTHROPIC_API_KEY` is absent), `ALLOWED_ORIGINS` (comma-separated list, default covers the Vite dev server), `LANGSMITH_TRACING`/`LANGSMITH_API_KEY`/`LANGSMITH_ENDPOINT`/`LANGSMITH_PROJECT` (LangSmith tracing — works for both Anthropic and Ollama automatically via LangChain's callback system, no provider-specific code needed).

The `.env` file lives at the **repo root**, not inside `backend/` or `frontend/`. The backend finds it because `load_dotenv()` (no args) walks up from the caller's file location. The frontend finds it because `vite.config.ts` sets `envDir: "../"` — without that, Vite would look for `.env` inside `frontend/` and silently miss every `VITE_*` variable. Frontend-consumed vars must be prefixed `VITE_` (`VITE_API_URL`, `VITE_API_KEY`) per Vite's convention.

## Architecture — backend

**`config/`** — shared config and AWS access, used by both the scraper and the RAG pipeline.
- `config.py`: `Config` class wraps the required env vars above and builds an S3 client (`get_s3_config`). Also exports the module-level `get_llm(temperature=0)`, the single place that decides Anthropic vs. Ollama — Anthropic is used only when `ANTHROPIC_API_KEY` is set, otherwise it falls back to a local Ollama model. Any code that needs an LLM should go through this function rather than instantiating `ChatAnthropic`/`ChatOllama` directly. Note: Claude 5 models reject an explicit `temperature` kwarg (400 Bad Request) — `get_llm()` only passes `temperature` to `ChatOllama`.
- `bucket_actions.py`: `upload_file(...)` stores a manual PDF at S3 key `{brand}/{model}/{year}/{name}.pdf`; `get_file_url(brand, model, year)` lists objects under that prefix and returns a presigned URL for the one found (raises `FileNotFoundError` if none, `ValueError` if more than one) — callers don't need to know the original filename.

**`web_scraping/`** — Playwright-based scraper (`Web_Scraping` class in `scraping.py`) that opens a manufacturer's manual page, finds the matching model+year manual link via regex, downloads it, and uploads it through `bucket_actions.upload_file`. `get_manual_renault` matches on `{model} {any month}/{year}` and takes `.first` — the year alone (no month) is the public contract, so multiple manuals for the same year all resolve to whichever appears first on the page. `scrape_and_upload()` runs the whole init→find→download→upload flow and returns the S3 key. Currently only `brand == "renault"` is implemented (Chevrolet support was added then removed — see git history); other brands raise `ValueError` in `init_page`. Manual QA against the real site lives in `run_manual_test.py`: `_RAW_TEST_CASES` keeps the full model/month/year list as documentation of real known manuals, and `TEST_CASES` is derived from it deduplicated to one case per (model, year) — matching how the scraper actually resolves now.

**`rag/`** — the RAG pipeline for answering questions about an already-uploaded manual. (This directory was originally named `langchain/`; renamed because a local module with that exact name shadows the real `langchain` pip package when run as a script — don't reintroduce that name here.)
- `load_document.py`: `LoadManual(brand, model, year)` resolves the manual's presigned S3 URL via `config.bucket_actions.get_file_url`; if the manual isn't in S3 yet (`FileNotFoundError`), it transparently triggers `Web_Scraping(...).scrape_and_upload()` and retries. Loads the PDF (`PyPDFLoader`, handles S3/web URLs natively), splits it with `RecursiveCharacterTextSplitter`, and builds a Chroma vector store with `OllamaEmbeddings` (embeddings are always local Ollama regardless of which chat LLM is selected — there's no Anthropic embedding option). `.retriever()` is the main entrypoint other code should call.
- `qa_chain.py`: `ManualQAChain(retriever)` wraps a retriever into a prompt | llm | parser chain. `ask(question)` is the main method — does retrieval once, returns `{"answer": str, "sources": list[str]}`. `text_prompt(question)` is a thin wrapper returning just the answer string (kept for `run_qa_test.py`). The LLM comes from `config.get_llm()`.
- `run_qa_test.py`: manual end-to-end test of the whole pipeline (see Commands above).

**Import style note**: no `__init__.py` files anywhere (implicit namespace packages). Everything (`config.*`, `web_scraping.*`, `rag.*`, `apis.*`) uses absolute imports assuming `backend/` itself is the root on `sys.path` — run modules with `python -m package.module` from `backend/`, not by path.

## Architecture — API layer (`apis/`)

- `models/car_model.py`: Pydantic schemas. `Car{brand, model, year}` (`year` is validated `^\d{4}$` — year only, no month). `ChatRequest{car, question}`. `ManualResponse{status: "found"|"scraped", car, message}`. `ChatResponse{car, question, answer, sources}`.
- `core/config.py`: `Settings` (pydantic-settings) — `api_key`, `allowed_origins` (comma-separated string, use the `allowed_origins_list` property to get a `list[str]`), `max_page_size` (declared, not yet used by anything).
- `core/security.py`: `verify_api_key` — `Security(APIKeyHeader(name="X-API-KEY"))` dependency, compares with `secrets.compare_digest` against `settings.api_key`.
- `services/car_service.py`: `get_manual(car)` checks S3 first, only scrapes if missing (mirrors `LoadManual`'s own fallback — the route explicitly checks so it can report `status: "found"` vs `"scraped"`). `prompt_ai(car, question)` builds a `LoadManual` + `ManualQAChain` and calls `.ask(question)`.
- `route/car_route.py`: `APIRouter(prefix="/askmycar", dependencies=[Depends(verify_api_key)])`. `POST /askmycar/get_manual` and `POST /askmycar/chat_ai`, both rate-limited via `slowapi` (`Limiter`, `10/minute`) and wrapped in `try/except` translating `ValueError` → 400 and anything else → 502 with a generic message (real exception printed server-side).
- `main.py` wires it all together: `app.state.limiter`, the `RateLimitExceeded` exception handler, `CORSMiddleware` (using `settings.allowed_origins_list`, no credentials since auth is a header not a cookie), and `app.include_router(router)`.

## Architecture — frontend (`frontend/src/`)

- `design/` — the UI/design system, self-contained from the API. `Router.tsx` (react-router-dom) wires 5 pages (`pages/`) inside `layout/AppShell.tsx`, with a `VehicleContext` (`context/`) holding the currently selected car across pages. `components/` are the reusable pieces (buttons, chat bubble, the tachometer-style `GaugeSpinner` loading state, etc.). `mock/fakeApi.ts` is a demo-only fake async layer (still used by nothing once `api/` is fully wired) with the same return shapes as the real API, so it was easy to swap out. `types.ts` mirrors the backend's response shapes.
- `api/` — the real API integration, being built incrementally by the user (not part of `design/`). `client.ts`: `apiClient<T>(endpoint, options)` generic fetch wrapper — reads `VITE_API_URL`/`VITE_API_KEY`, JSON-encodes `body`, throws `ApiError` (carries the real HTTP `status`) on non-2xx responses using `detail` (FastAPI's `HTTPException` shape) or `error` (slowapi's 429 shape) as the message. `services/car_services.ts`: `getManual(car)` and `chatBot(car, question)` call the two real endpoints; both must use the `/askmycar/...` prefix (easy to forget — the router's prefix isn't part of the route path shown in each `@router.post(...)` decorator).
- Tailwind v4 is configured CSS-first (`@theme` block in `index.css`, no `tailwind.config.js`) — custom color tokens (`base-*` graphite, `accent-*` amber, `tel-*` cyan, `ok-*`/`warn-*`/`danger-*`) and animations (`animate-rise-in`, `animate-needle-sweep`, etc.) are defined there.
