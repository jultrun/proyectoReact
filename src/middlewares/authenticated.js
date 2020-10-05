  
const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "falta el token" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "el token fallo" });

    req.usuario = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = authenticated;