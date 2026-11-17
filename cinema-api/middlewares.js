export function validerId(req, res, next, idStr) {
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erreur: "ID invalide" });
  }
  req.id = id;
  next();
}