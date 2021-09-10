const { Router } = require("express");
// eslint-disable-next-line import/no-unresolved
const { humanId } = require("human-id");

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/join-room", (req, res) => {
  res.redirect(`/rooms/${req.query.room}`);
});

router.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;

  const userId = humanId("-");

  res.render("room", { roomId, userId });
});

exports.router = router;
