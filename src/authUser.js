const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({
  path: `${__dirname}/envvars.env`,
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.render("not_signed_in");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  });
}

module.exports = { authenticateToken };
