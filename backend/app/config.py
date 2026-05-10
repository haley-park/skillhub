from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+psycopg2://skillhub:skillhub@localhost:5432/skillhub"
    skills_dir: str = "~/skillhub/skills"
    commands_dir: str = "~/.claude/commands"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    @property
    def skills_path(self) -> Path:
        return Path(self.skills_dir).expanduser().resolve()

    @property
    def commands_path(self) -> Path:
        return Path(self.commands_dir).expanduser().resolve()


settings = Settings()
