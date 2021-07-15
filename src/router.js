const { Router } = require("express");
// eslint-disable-next-line import/no-unresolved
const { humanId } = require("human-id");

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/join-room", (req, res) => {
  const { room } = req.query;

  res.setHeader("Location", `/rooms/${room}`);

  res.status(303).end();
});

router.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;

  const userId = humanId("-");

  res.render("room", { roomId, userId });
});

exports.router = router;
