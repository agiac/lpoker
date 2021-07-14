const { Router } = require("express");
const { nanoid } = require("nanoid");
const { humanId } = require("human-id");

const router = Router();

router.post("/create-room", (req, res) => {
  const newRoomId = nanoid(6);

  res.setHeader("Location", `/?roomId=${newRoomId}`);

  res.status(303).end();
});

router.get("/", (req, res) => {
  const { roomId } = req.query;

  res.render("index", { roomId });
});

router.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const userId = humanId("-");

  res.render("room", { roomId, userId });
});

exports.router = router;
