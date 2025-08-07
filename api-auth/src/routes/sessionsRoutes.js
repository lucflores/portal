const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

