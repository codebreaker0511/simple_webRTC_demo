const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname));

app.post("/api/client-secret", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-realtime-2.1",
            instructions:
              "You are a friendly, conversational voice assistant. " +
              "Speak naturally and concisely. Use the user's webcam " +
              "images as visual context when relevant.",
            audio: {
              output: {
                voice: "marin"
              }
            }
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create realtime session"
    });
  }
});

app.listen(3000, "127.0.0.1", () => {
  console.log("Open http://localhost:3000");
});
