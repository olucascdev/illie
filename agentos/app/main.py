from os import getenv

from dotenv import load_dotenv

load_dotenv()  # carrega o .env antes de qualquer import que use env vars

from agno.os import AgentOS                 

from agents.illie_agent import illie_agent
from db import get_postgres_db

# ---------------------------------------------------------------------------
# Create AgentOS — builds FastAPI app and all routes automatically
# ---------------------------------------------------------------------------
agent_os = AgentOS(
    name="Illie",
    db=get_postgres_db(),
    agents=[illie_agent],
)

app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(
        app="app.main:app",
        host="0.0.0.0",
        port=7777,
        reload=getenv("RUNTIME_ENV", "prd") == "dev",
    )