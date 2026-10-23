import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000")
  .replace(/\/+$/, "");

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await fetch(`${API_BASE_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await result.json().catch(() => ({}));
      if (!result.ok) {
        throw new Error(data.error || "The request could not be completed.");
      }

      setResponse(data.answer || "No answer was returned.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <h1>AI Study Helper</h1>
      <p>Ask a study question and get a clear, student-friendly explanation.</p>

      <form onSubmit={askQuestion}>
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask something..."
          aria-label="Your study question"
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {error && <p role="alert" className="error">{error}</p>}
      {response && (
        <section aria-live="polite">
          <h2>Answer</h2>
          <p className="output">{response}</p>
        </section>
      )}
    </main>
  );
}

export default App;
