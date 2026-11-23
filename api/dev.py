"""Run the frontend and API together for local development."""

import subprocess
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    client = subprocess.Popen(["bun", "run", "--cwd", str(ROOT / "client"), "dev"], cwd=ROOT)
    try:
        uvicorn.run(
            "api.main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            reload_dirs=[str(ROOT / "api")],
        )
    finally:
        client.terminate()
        client.wait()
