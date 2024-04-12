import express from "express";

import TowerModel from "./models/Tower";
import UserModel from "./models/User";

import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/user", (req, res) => {
  UserModel.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/tower", auth.ensureLoggedIn, (req, res) => {
  const newTower = new TowerModel({
    creator_id: req.user!._id,
    radius: req.body.radius,
    gradient: req.body.gradient,
  });

  newTower.save().then((tower) => res.send(tower));
});

router.get("/towers", (req, res) => {
  const creatorId = req.query.creator_id as string;
  
  TowerModel.find({creator_id: creatorId}).then((towers) => {
    res.send(towers);
  });
});

router.delete("/tower", auth.ensureLoggedIn, (req, res) => {
  TowerModel.deleteOne({ _id: req.body.tower_id }).then(() => {
    res.send({});
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
