import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

const allowed = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://booksy-client.netlify.app"
];

app.use(
  cors({
    origin: allowed,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Booksy API running");
});

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
