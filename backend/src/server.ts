import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generate } from "./gemini";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// ===== Utils =====
const createResponse = <T>(success: boolean, data?: T, error?: string) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// ===== Routes =====
app.get("/", (req: Request, res: Response) => {
  res.send("🤖 Chatbot API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===== Chat Endpoint =====

const chatHistory: { role: "user" | "assistant"; text: string }[] = [];
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    chatHistory.push({ role: "user", text: message });
    const fullConversation = chatHistory
      .map((c) => `${c.role === "user" ? "User" : "Asisten"}: ${c.text}`)
      .join("\n");

    const reply = await generate(fullConversation);

    chatHistory.push({ role: "assistant", text: reply });

    res.json({
      success: true,
      data: { reply },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Gagal menghasilkan respons" });
  }
});

// ===== Error Handling =====
app.use((req: Request, res: Response) => {
  res.status(404).json(createResponse(false, undefined, "Endpoint not found"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  console.error("Unhandled error:", message);
  res.status(500).json(createResponse(false, undefined, message));
});

app.listen(PORT, () => {
  console.log(`🤖 Chatbot server running on http://localhost:${PORT}`);
});
