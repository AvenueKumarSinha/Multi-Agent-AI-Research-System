
import { useState } from "react";
import "./App.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function ResultSection({ title, content }) {
  return (
    <section className="result-card">
      <h2>{title}</h2>
      <div className="result-content">
        {content || "No content available."}
      </div>
    </section>
  );
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResearch(event) {
    event.preventDefault();

    if (topic.trim().length < 2) {
      setError("Please enter a research topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (!API_URL) {
        throw new Error("The backend URL has not been configured.");
      }

      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Research could not be completed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="brand">MULTI-AGENT RESEARCH ASSISTANT</div>

        <h1>
          Research smarter.
          <br />
          <span>Discover deeper.</span>
        </h1>

        <p className="subtitle">
          Search the web, examine sources, generate a research report,
          and get a critical review from your AI research pipeline.
        </p>

        <form className="search-form" onSubmit={handleResearch}>
          <label className="sr-only" htmlFor="topic">
            Research topic
          </label>

          <input
            id="topic"
            type="text"
            placeholder="e.g. Recent advances in small language models"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            minLength={2}
            maxLength={300}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Researching..." : "Start research"}
          </button>
        </form>

        <p className="hint">
          Enter a technology, scientific topic, or emerging trend.
        </p>
      </header>

      {loading && (
        <section className="loading-card" aria-live="polite">
          <div className="spinner" />
          <h2>Research in progress</h2>
          <p>
            The research pipeline is searching, reading, writing,
            and reviewing. This may take a little while.
          </p>
        </section>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="results">
          <div className="results-heading">
            <p className="eyebrow">RESEARCH COMPLETE</p>
            <h2>{result.topic}</h2>
          </div>

          <ResultSection
            title="01 · Web search"
            content={result.search_results}
          />

          <ResultSection
            title="02 · Source analysis"
            content={result.scraped_content}
          />

          <ResultSection
            title="03 · Research report"
            content={result.report}
          />

          <ResultSection
            title="04 · Critic's review"
            content={result.feedback}
          />
        </section>
      )}

      <footer>ResearchAI · Multi-Agent AI Research System</footer>
    </main>
  );
}
