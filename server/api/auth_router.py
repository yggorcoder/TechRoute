from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from domain.models import User, Token, UserCreate, UserInDB

from application.auth_service import AuthService

from application.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user

router = APIRouter()
auth_service = AuthService()

@router.post("/register", response_model=User)
def register_user(user_data: UserCreate):
    """registra um novo usuário"""
    return auth_service.create_user(user_data)

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint para login. retorna um token de acesso"""
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=User)
def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """Rota protegida que retorna os dados do usuário logado."""
    return current_user