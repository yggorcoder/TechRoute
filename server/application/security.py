import os
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# --- Imports de Modelos ---
from domain.models import User

# --- Senhas: usar bcrypt_sha256 (sem limite de 72 bytes) ---
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- Configuração do JWT ---

# Tenta pegar a SECRET_KEY do ambiente. Se não existir ou for vazia, usa a chave padrão.
SECRET_KEY = os.getenv("SECRET_KEY") or "09d25e004faa6ca2556c818166b7a9563b03f7009f6f0f4caa6cf63b08e8d3e7"

# Se você ainda quiser o aviso no console, pode verificar qual valor foi usado.
if SECRET_KEY == "09d25e004faa6ca2556c818166b7a9563b03f7009f6f0f4caa6cf63b08e8d3e7":
    print("AVISO: A variável de ambiente SECRET_KEY não está definida. Usando uma chave padrão insegura.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# --- Funções para JWT ---
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Cria um novo token de acesso."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Função de Dependência para Obter Usuário Atual ---
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Decodifica o token, valida e retorna o usuário atual.
    Esta é a dependência que será usada para proteger as rotas.
    Retorna o modelo `User` público, sem a senha com hash.
    """
    # Importação tardia para evitar dependência circular
    from application.auth_service import AuthService
    auth_service = AuthService()

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_in_db = auth_service.get_user(username=username)
    if user_in_db is None:
        raise credentials_exception
    
    # Retorna o modelo User, não UserInDB, para não expor a senha com hash
    return User.model_validate(user_in_db)