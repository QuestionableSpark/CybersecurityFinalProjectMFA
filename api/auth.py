"""Authentication steps reserved for the course implementation."""

from pathlib import Path


def authenticate_password(username: str, password: str, db_path: Path) -> str:
    """Check a salted password hash; return a pending second-factor challenge ID."""
    raise NotImplementedError("Password authentication is not implemented")


def verify_second_factor(challenge_id: str, code: str, db_path: Path) -> bool:
    """Validate the selected OTP scheme and consume its challenge."""
    raise NotImplementedError("Second-factor verification is not implemented")
