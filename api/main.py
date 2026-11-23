"""Login API; authentication deliberately remains unimplemented."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from api.auth import authenticate_password, verify_second_factor
from api.db import database_path, initialize_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="MFA Portal", lifespan=lifespan)


class LoginRequest(BaseModel):
    username: str
    password: str


class OtpRequest(BaseModel):
    challenge_id: str
    code: str


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
