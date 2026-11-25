"""Login API; authentication is now implemented."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from api.auth import authenticate_password, verify_second_factor, create_user, UsernameTaken
from api.db import database_path, initialize_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="MFA Portal", lifespan=lifespan)

class RegisterRequest(BaseModel):
    username: str = Field(min_length=5, max_length=32, pattern=r"^[A-Za-z0-9_.-]+$")
    password: str = Field(min_length=8, max_length=64)

class LoginRequest(BaseModel):
    username: str
    password: str


class OtpRequest(BaseModel):
    challenge_id: str
    code: str

@app.post("/api/auth/register", status_code=201)
def register(request: RegisterRequest):
    try:
        create_user(request.username, request.password, database_path())
    except UsernameTaken as exc:
        raise HTTPException(status_code=409, detail="Username already taken") from exc
    return {"username": request.username}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    try:
        return {"challenge_id": authenticate_password(request.username, request.password, database_path())}
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc


@app.post("/api/auth/verify-otp")
def verify_otp(request: OtpRequest):
    try:
        return {"authenticated": verify_second_factor(request.challenge_id, request.code, database_path())}
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
