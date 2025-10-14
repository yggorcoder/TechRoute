from fastapi import HTTPException
from typing import Optional

from domain.models import User, UserInDB, UserCreate, Role
from application.security import get_password_hash, verify_password

# --- BANCO DE DADOS FAKE (Temporário) ---
# Em uma aplicação real, isso seria substituído por chamadas ao seu repositório
# que interage com um banco de dados de verdade (ex: PostgreSQL, MongoDB).
fake_users_db = {
    "manager": {
        "username": "manager",
        "email": "manager@techroute.com",
        "role": "manager",
        "hashed_password": get_password_hash("manager_password")
    },
    "technician1": {
        "username": "technician1",
        "email": "technician1@techroute.com",
        "role": "technician",
        "hashed_password": get_password_hash("technician1_password")
    }

}
# -----------------------------------------

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
                role=Role(user_data["role"]), # type: ignore
                hashed_password=user_data["hashed_password"]
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
            hashed_password=hashed_password
        )
        
        fake_users_db[user_in_db.username] = user_in_db.model_dump()

        return User(
            username=user_in_db.username,
            email=user_in_db.email,
            role=user_in_db.role
        )

    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        """Autentica um usuário."""
        user_in_db = self.get_user(username)
        if not user_in_db:
            return None  # Usuário não encontrado

        if not verify_password(password, user_in_db.hashed_password):
            return None  # Senha incorreta

        return user_in_db
