"""Authentication steps reserved for the course implementation."""

import sqlite3

from contextlib import closing

from pathlib import Path

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

_hasher = PasswordHasher()

class UsernameTaken(Exception):
    """Raised when new user attempts an already registered username."""

# create_user function: Checks if new username is taken, if not stores the password
# into the database
def create_user(username: str, password: str, db_path: Path) -> None:
    """Hash the password and store a new user: calls UsernameTaken if username taken"""
    password_hash = hash_password(password)
    try:
        with closing(sqlite3.connect(db_path)) as connection:
            connection.execute( "Insert into users (username, password_hash) VALUES (?, ?)",
                               (username, password_hash))
            connection.commit()
    except sqlite3.IntegrityError as exc:
        raise UsernameTaken(username) from exc

# TODO: Implement the following functions to support password authentication and second-factor verification.
# Adding the password hash that will be called when a user is created
def hash_password(password: str) -> str:
    """Return a salted hash of the password string and store in user.password_hash."""
    return _hasher.hash(password)

# Adding the verify_password which will be called from authenticate_password
# after looking up the user in the database and retrieving the password hash
def verify_password(stored_hash: str, password: str) -> bool:
    """Return True if password matches stored_hash, false otherwise."""
    try:
        return _hasher.verify(stored_hash, password)
    except VerifyMismatchError:
        return False

def authenticate_password(username: str, password: str, db_path: Path) -> str:
    """Check a salted password hash; return a pending second-factor challenge ID."""
    raise NotImplementedError("Password authentication is not implemented")


def verify_second_factor(challenge_id: str, code: str, db_path: Path) -> bool:
    """Validate the selected OTP scheme and consume its challenge."""
    raise NotImplementedError("Second-factor verification is not implemented")
