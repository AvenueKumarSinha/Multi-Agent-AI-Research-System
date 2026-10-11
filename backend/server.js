import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "1mb" }));

const clientUrl = process.env.CLIENT_URL;

if (!clientUrl) {
  throw new Error("CLIENT_URL is missing from backend environment variables.");
}

app.use(
  cors({
    origin: clientUrl,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "node-backend" });
});

app.post("/api/research", async (req, res) => {
  const { topic } = req.body || {};

  if (
    typeof topic !== "string" ||
    topic.trim().length < 2 ||
    topic.trim().length > 300
  ) {
    return res.status(400).json({
      error: "Enter a topic between 2 and 300 characters.",
    });
  }

  const pythonApiUrl = process.env.PYTHON_API_URL;

  if (!pythonApiUrl) {
    return res.status(500).json({
      error: "Python API URL is not configured.",
    });
  }

  try {
    const response = await fetch(
      `${pythonApiUrl.replace(/\/$/, "")}/research`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
        signal: AbortSignal.timeout(180000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || "The research service failed.",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Research request failed:", error);
    console.error("Error cause:", error.cause);

    if (error.name === "TimeoutError") {
      return res.status(504).json({
        error: "Research took too long. Please try again."
      });
    }

    return res.status(502).json({
      error: "Could not connect to the Python research service.",
      details: error.cause?.message || error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Node backend running on port ${PORT}`);
});
