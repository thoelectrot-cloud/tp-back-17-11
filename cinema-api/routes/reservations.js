import express from "express";
import { reservations } from "../data.js";

const router = express.Router();

// DELETE /reservations/:id
router.delete("/:id", (req, res) => {
  const index = reservations.findIndex(r => r.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Réservation non trouvée" });

  reservations.splice(index, 1);
  res.status(204).send();
});

export default router;