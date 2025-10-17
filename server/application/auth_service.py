# server/application/auth_service.py
from fastapi import HTTPException
from typing import Optional, Dict, TypedDict

from domain.models import User, UserInDB, UserCreate, Role
from application.security import get_password_hash, verify_password

# ---- Tipos auxiliares -------------------------------------------------
class UserDBRecord(TypedDict):
    username: str
    email: str
    role: str           # guardamos como string no "db fake"
    hashed_password: str

# "db fake" tipado
fake_users_db: Dict[str, UserDBRecord] = {}

def seed_fake_db() -> None:
    """Popula o 'db fake' somente no startup (evita crash no import)."""
    fake_users_db.update({
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
    })

# -----------------------------------------------------------------------

class AuthService:
    def get_user(self, username: str) -> Optional[UserInDB]:
        """Busca um usuário no banco de dados fake."""
        user_data = fake_users_db.get(username)
        if not user_data:
            return None
        try:
            return UserInDB(
                username=user_data["username"],
                email=user_data["email"],
                role=Role(user_data["role"]),         # converte str -> Role
                hashed_password=user_data["hashed_password"],
            )
        except (KeyError, ValueError):
            return None

    def create_user(self, user_data: UserCreate) -> User:
        """Cria um novo usuário."""
        if self.get_user(user_data.username):
            raise HTTPException(status_code=400, detail="Username already registered")

        hashed_password = get_password_hash(user_data.password)

        user_in_db = UserInDB(
            username=user_data.username,
            email=user_data.email,
            role=user_data.role,
            hashed_password=hashed_password,
        )
        fake_users_db[user_in_db.username] = UserDBRecord(
            username=user_in_db.username,
            email=user_in_db.email,
            role=user_in_db.role.value if hasattr(user_in_db.role, "value") else str(user_in_db.role),
            hashed_password=user_in_db.hashed_password,
        )

        return User(
            username=user_in_db.username,
            email=user_in_db.email,
            role=user_in_db.role,
        )

    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        """Autentica um usuário."""
        user_in_db = self.get_user(username)
        if not user_in_db:
            return None
        if not verify_password(password, user_in_db.hashed_password):
            return None
        return user_in_db

