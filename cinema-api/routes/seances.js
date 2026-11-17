import express from "express";
import { seances, films, reservations, prochainId, placesRestantes } from "../data.js";

const router = express.Router();

// POST /seances
router.post("/", (req, res) => {
  const { filmId, date, heure, salle, places } = req.body;

  // 400: validation checks
  if (!filmId || !date || !heure || !salle || typeof places !== "number" || places < 1) {
    return res.status(400).json({ erreur: "Données de séance invalides" });
  }

  // 404: film must exist
  const film = films.find(f => f.id === filmId);
  if (!film) {
    return res.status(404).json({ erreur: "Film non trouvé" });
  }

  const nouvelleSeance = {
    id: prochainId(seances),
    filmId,
    date,
    heure,
    salle,
    places
  };

  seances.push(nouvelleSeance);
  res.status(201).json(nouvelleSeance);
});

// GET /seances/:id
router.get("/:id", (req, res) => {
  const seance = seances.find(s => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance non trouvée" });

  res.json({
    ...seance,
    placesRestantes: placesRestantes(seance)
  });
});

// POST /seances/:id/reservations
router.post("/:id/reservations", (req, res) => {
  const { nom, nbPlaces } = req.body;

  // 400: check body validation (nom & nbPlaces between 1 and 10)
  if (!nom || typeof nbPlaces !== "number" || nbPlaces < 1 || nbPlaces > 10) {
    return res.status(400).json({ erreur: "Réservation invalide (nbPlaces doit être entre 1 et 10)" });
  }

  // 404: check session existence
  const seance = seances.find(s => s.id === req.id);
  if (!seance) {
    return res.status(404).json({ erreur: "Séance non trouvée" });
  }

  // 409: check remaining seats business rule
  const rest = placesRestantes(seance);
  if (nbPlaces > rest) {
    return res.status(409).json({ erreur: "Pas assez de places restantes" });
  }

  const nouvelleReservation = {
    id: prochainId(reservations),
    seanceId: req.id,
    nom,
    nbPlaces
  };

  reservations.push(nouvelleReservation);
  res.status(201).json(nouvelleReservation);
});

// GET /seances/:id/reservations
router.get("/:id/reservations", (req, res) => {
  const seance = seances.find(s => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance non trouvée" });

  const seanceReservations = reservations.filter(r => r.seanceId === req.id);
  res.json(seanceReservations);
});

export default router;