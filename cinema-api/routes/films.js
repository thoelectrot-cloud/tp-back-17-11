import express from "express";
import { films, seances, prochainId } from "../data.js";

const router = express.Router();

// GET /films (with optional genre filter and tri=duree sorting)
router.get("/", (req, res) => {
  let resultat = [...films];

  if (req.query.genre) {
    resultat = resultat.filter(f => f.genre.toLowerCase() === req.query.genre.toLowerCase());
  }

  if (req.query.tri === "duree") {
    resultat.sort((a, b) => a.duree - b.duree);
  }

  res.json(resultat);
});

// GET /films/:id
router.get("/:id", (req, res) => {
  const film = films.find(f => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film non trouvé" });
  res.json(film);
});

// GET /films/:id/seances
router.get("/:id/seances", (req, res) => {
  const film = films.find(f => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film non trouvé" });

  const filmSeances = seances.filter(s => s.filmId === req.id);
  res.json(filmSeances);
});

// POST /films
router.post("/", (req, res) => {
  const { titre, genre, duree } = req.body;

  // 400: missing or invalid fields
  if (!titre || !genre || typeof duree !== "number" || duree <= 0) {
    return res.status(400).json({ erreur: "Données invalides" });
  }

  // 409: duplicate title
  const existe = films.some(f => f.titre.toLowerCase() === titre.toLowerCase());
  if (existe) {
    return res.status(409).json({ erreur: "Un film avec ce titre existe déjà" });
  }

  const nouveauFilm = {
    id: prochainId(films),
    titre,
    genre,
    duree
  };

  films.push(nouveauFilm);
  res.status(201).json(nouveauFilm);
});

// DELETE /films/:id
router.delete("/:id", (req, res) => {
  const index = films.findIndex(f => f.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Film non trouvé" });

  // 409: forbidden if the film has active sessions
  const hasSeances = seances.some(s => s.filmId === req.id);
  if (hasSeances) {
    return res.status(409).json({ erreur: "Impossible de supprimer un film avec des séances" });
  }

  films.splice(index, 1);
  res.status(204).send();
});

export default router;