const express = require("express");
const passport = require("passport");
const router = express.Router();

// Mount Passport strategies
router.get("/google", (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, (err, next) => {
    if (err) return res.redirect("/login");
    return res.redirect("/auth/google");
  });
});

// Note: The actual strategy logic should be in auth.js middleware or handled via the strategy setup in auth.js
// Here we assume the passport.use() is handled in a separate auth.js controller file or mounted directly.
// For simplicity, this router acts as the entry point if strategies are global.
// If strategies are in auth.js, we just need to ensure passport is initialized.
router.get("/callback", (req, res) => {
  // Placeholder to ensure route exists if not handled fully in auth.js
  res.send("Auth callback triggered");
});

module.exports = router;