"""Local SQLite storage for future user credentials."""

import os
import sqlite3
from contextlib import closing
from pathlib import Path

DEFAULT_DB_PATH = Path(__file__).resolve().parents[1] / "data" / "auth.db"


def database_path() -> Path:
    return Path(os.environ.get("MFA_DB_PATH", DEFAULT_DB_PATH))


def initialize_database() -> None:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(path)) as connection:
        connection.execute(
            """CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL
            )"""
        )
        connection.commit()


# password_hash will hold a salted, self-describing password hash (e.g. Argon2 PHC),
# never a plaintext password. No accounts are created by this scaffold.
