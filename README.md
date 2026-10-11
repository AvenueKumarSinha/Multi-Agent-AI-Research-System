# Multi-Agent AI Research System

An AI-powered research system that automates the process of researching a given topic by searching the web, extracting relevant content, and generating a structured research report using AI agents.

## Features

- **Web Search:** Finds relevant web pages for a given research topic using Tavily.
- **Content Extraction:** Extracts readable content from web pages using Requests and BeautifulSoup.
- **Multi-Agent Research:** Uses AI agents to assist with research and content analysis.
- **Report Generation:** Generates a structured research report using an AI-powered writing and review pipeline.
- **Writer-Critic Workflow:** Uses a writer and critic workflow to improve the generated report.
- **Web Interface:** Provides a React-based frontend for submitting research topics and viewing results.
- **Backend API:** Uses Node.js and Express to communicate between the frontend and the Python research service.

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- CORS

**AI Research Service**
- Python
- FastAPI
- LangChain
- Google Gemini
- Tavily Search API
- Requests
- BeautifulSoup

## Project Structure

```text
Multi-Agent-AI-Research-System/
├── frontend/
│   ├── src/
│   ├── .env
│   └── package.json
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
└── python_service/
    ├── agents.py
    ├── tools.py
    ├── pipeline.py
    ├── api.py
    ├── requirements.txt
    └── .env
```

## Running the Project

Start all three services in **three separate terminals**. Keep each terminal running while using the application.

### Terminal 1: Python Research API

From the project root:

```powershell
cd python_service
.\.venv\Scripts\Activate.ps1
python -m uvicorn api:app --reload --port 8000
```

### Terminal 2: Node.js Backend

From the project root, open a second terminal:

```bash
cd backend
npm start
```

### Terminal 3: React Frontend

From the project root, open a third terminal:

```bash
cd frontend
npm run dev
```

## How It Works

1. The user submits a research topic through the React frontend.
2. The Node.js backend validates the request and forwards it to the Python API.
3. The Python research pipeline uses Tavily to search for relevant web pages.
4. The content extraction tools retrieve readable page content.
5. AI agents process the collected information and generate a research report.
6. The writer-critic workflow reviews the report.
7. The results are returned through the backend and displayed in the frontend.

## Environment Variables

| Service | Variable | Purpose |
|---|---|---|
| Python | `GOOGLE_API_KEY` | Authenticates with Google Gemini |
| Python | `TAVILY_API_KEY` | Authenticates with Tavily |
| Python | `FRONTEND_URLS` | Allowed frontend origin(s) for CORS |
| Backend | `CLIENT_URL` | Frontend origin allowed by the backend |
| Backend | `PYTHON_API_URL` | Base URL of the Python API |
| Frontend | `VITE_API_URL` | Base URL of the Node.js backend |

The names above must match those used by your source code. Do not share or commit files containing real API keys.

## Limitations

- Research quality depends on the search results and the content accessible from the selected web pages.
- Some websites may block automated requests or limit content extraction.
- AI model availability and API quotas can affect report generation.
- The project currently requires the Python service, Node.js backend, and React frontend to run separately.
