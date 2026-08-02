FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .
RUN uv sync --frozen --no-dev

# Installs Chromium plus the system libraries it needs (fonts, gtk, etc.)
RUN uv run playwright install --with-deps chromium

ENV PYTHONUTF8=1
EXPOSE 8000

CMD uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
