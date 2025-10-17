# server/application/auth_service.py
from typing import Optional, Dict, TypedDict
from fastapi import HTTPException

from domain.models import User, UserInDB, UserCreate, Role
from application.security import get_password_hash, verify_password


# -------------------------------
# Tipos e "DB" em memória (fake)
# -------------------------------
class UserDBRecord(TypedDict):
    username: str
    email: str
    role: str            # armazenamos como STRING no "db fake"
    hashed_password: str

# username -> registro
fake_users_db: Dict[str, UserDBRecord] = {}


def seed_fake_db() -> None:
    """Popula o 'db fake' no startup (evita crash no import)."""
    fake_users_db.clear()
    fake_users_db.update(
        {
            "manager": {
                "username": "manager",
                "email": "manager@techroute.com",
                "role": "manager",
                "hashed_password": get_password_hash("manager_password"),
            },
            "technician1": {
                "username": "technician1",
                "email": "technician1@techroute.com",
                "role": "technician",
                "hashed_password": get_password_hash("technician1_password"),
            },
        }
    )


# -------------------------------
# Serviço de autenticação
# -------------------------------
class AuthService:
    def get_user(self, username: str) -> Optional[UserInDB]:
        """Busca um usuário no 'db fake' e retorna UserInDB (ou None)."""
        data = fake_users_db.get(username)
        if not data:
            return None
        try:
            return UserInDB(
                username=data["username"],
                email=data["email"],
                role=Role(data["role"]),              # converte string -> Enum
                hashed_password=data["hashed_password"],
            )
        except (KeyError, ValueError):
            return None

    def create_user(self, new_user: UserCreate) -> User:
        """Cria um novo usuário no 'db fake'."""
        # Evita duplicidade
        if self.get_user(new_user.username):
            raise HTTPException(status_code=400, detail="Username already registered")

        # Hash da senha
        hashed = get_password_hash(new_user.password)

        # Persiste APENAS tipos primitivos no 'db' (role -> string)
        fake_users_db[new_user.username] = UserDBRecord(
            username=new_user.username,
            email=new_user.email,
            role=new_user.role.value,                # salva como string
            hashed_password=hashed,
        )

        # Resposta pública (sem senha) — mantém Enum
        return User(
            username=new_user.username,
            email=new_user.email,
            role=new_user.role,
        )

    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        """Autentica pelo username/senha (ou retorna None)."""
        user = self.get_user(username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user



