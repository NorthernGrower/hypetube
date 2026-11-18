const express = require("express");
const router = express.Router();
const User = require("../schemas/User");

router.get("/user", (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.json({ error: err.message });
    res.json(users);
  });
});

module.exports = router;