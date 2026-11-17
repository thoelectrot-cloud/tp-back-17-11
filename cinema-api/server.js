import express from "express";
import { validerId } from "./middlewares.js";
import filmsRouter from "./routes/films.js";
import seancesRouter from "./routes/seances.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Register parameter interceptor for :id
app.param("id", validerId);

// Mount routers
app.use("/films", filmsRouter);
app.use("/seances", seancesRouter);
app.use("/reservations", reservationsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ erreur: "Route inconnue" });
});

app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));